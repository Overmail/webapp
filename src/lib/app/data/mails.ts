import {writable, type Writable} from "svelte/store";

let webSockets: Map<string, WebSocket> = new Map()

interface ApiMailItem {
    id: string;
    subject: string;
    from: string;
    sent_at: number;
    is_read: boolean;
    has_attachments: boolean;
    preview_text: string;
}

let apiMailItems: Map<string, Writable<ApiMailItem[]>> = new Map()

async function connectWebSocket(folderId: string): Promise<WebSocket> {
    let webSocket = webSockets.get(folderId)
    if (webSocket) {
        webSocket.close()
    }

    const store = (() =>  {
        const mapStore = apiMailItems.get(folderId)
        if (!mapStore) {
            const newMapStore = writable<ApiMailItem[]>([])
            apiMailItems.set(folderId, newMapStore)
            return newMapStore
        }
        return mapStore
    })()

    let hadSuccess = false;
    try {
        webSocket = new WebSocket(`/api/webapp/realtime/mail/${folderId}`)
    } catch (e) {
        console.error("Failed to connect to WebSocket", e);

        // retry recursively after 1 second and return the promise
        return new Promise<WebSocket>((resolve) => {
            setTimeout(() => {
                resolve(connectWebSocket(folderId));
            }, 1000);
        });
    }

    webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "new-mails") {
            if (!hadSuccess) store.set(data.mails)
            else {
                const apiMailItemIds: string[] = data.mails.map((m: ApiMailItem) => m.id)
                store.update(currentMails => {
                    const currentMailsWithOutNewMails = currentMails.filter(mail => !apiMailItemIds.includes(mail.id))
                    return [...currentMailsWithOutNewMails, ...data.mails].sort((a, b) => b.sent_at - a.sent_at)
                })
            }
            hadSuccess = true;
        }
    }

    webSocket.onclose = (e: CloseEvent) => {
        if (e.code !== 1000) {
            console.info("WebSocket connection closed unexpectedly", e.reason);
            console.info(
                "Attempting to reconnect in 1 second...",
                e.reason
            )
            setTimeout(() => connectWebSocket(folderId), 1000);
        }
    }

    webSockets.set(folderId, webSocket)
    return webSocket;
}

export async function subscribeToMails(folderId: string, mailsForFolder: Writable<Email[]>) : Promise<MailSubscriber> {
    const webSocket = await connectWebSocket(folderId);

    const unsubscriber = apiMailItems.get(folderId)!.subscribe((apiMails) => {
        const mails = apiMails.map(mail => new Email(mail))
        mailsForFolder.set(mails)
    })

    return new MailSubscriber(() => {
        webSockets.get(folderId)?.close()
        unsubscriber()
    }, webSocket)
}

export class MailSubscriber {
    unsubscriber: () => void;
    private webSocket: WebSocket;

    constructor(unsubscriber: () => void, webSocket: WebSocket) {
        this.unsubscriber = unsubscriber;
        this.webSocket = webSocket;
    }

    requestNextChunk() {
        this.webSocket.send(JSON.stringify({
            type: "request_next_chunk"
        }))
    }
}

export class Email {
    id: string;
    subject: string;
    senderName: string;
    sentAt: Date;
    isRead: boolean;
    previewText: string;

    constructor(mail: ApiMailItem) {
        this.id = mail.id;
        this.subject = mail.subject;
        this.senderName = mail.from;
        this.sentAt = new Date(mail.sent_at * 1000);
        this.isRead = mail.is_read;
        this.previewText = mail.preview_text;
    }
}