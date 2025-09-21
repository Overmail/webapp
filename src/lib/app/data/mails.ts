import {get, readable, writable} from "svelte/store";
import type {
    ApiMailItem,
    MailWebSocketMessage,
    MailWebSocketMetadataMessage,
    MailWebSocketNewMailsMessage
} from "$lib/app/data/mails/api_websocket";

const mailSubscriberMap: Map<string, MailSubscriber> = new Map()

export function getMailSubscriberForFolder(folderId: string) {
    let mailSubscriber = mailSubscriberMap.get(folderId)
    if (!mailSubscriber) {
        mailSubscriber = new MailSubscriber(folderId)
        mailSubscriberMap.set(folderId, mailSubscriber)
    }
    return mailSubscriber
}

export class MailSubscriber {

    private webSocket: WebSocket | null = null;
    private readonly folderId: string;

    private _totalMails = writable(0)
    totalMails = readable(0, (set) => {
        this._totalMails.subscribe(set)
    })

    private _fetchedMails = writable(0)
    fetchedMails = readable(0, (set) => {
        this._fetchedMails.subscribe(set)
    })

    private _isReady = writable(false);
    isReady = readable(false, (set) => {
        this._isReady.subscribe(set)
    })

    private _emails = writable<EmailItem[]>([])
    emails = readable<EmailItem[]>([], (set) => {
        this._emails.subscribe(set)
    })
    private hasEverLoadedMails = false;

    constructor(folderId: string) {
        this.folderId = folderId;
        console.log("New MailSubscriber for folder", folderId)
        this.setupWebSocket()
    }

    setupWebSocket() {
        if (this.webSocket?.readyState === WebSocket.OPEN) return;
        if (this.webSocket?.readyState === WebSocket.CONNECTING) return;
        console.log("Setting up WebSocket for folder", this.folderId)
        this.closeWebSocket()

        this.webSocket = new WebSocket(`/api/webapp/realtime/mails/${this.folderId}`)

        this.webSocket.onclose = (e: CloseEvent) => {
            if (e.code !== 1000) {
                console.info("WebSocket connection closed unexpectedly", e.reason);
                console.info(
                    "Attempting to reconnect in 1 second...",
                    e.reason
                )
                setTimeout(() => this.setupWebSocket(), 1000);
            }
        }

        this.webSocket.onmessage = (event) => {
            const message: MailWebSocketMessage = JSON.parse(event.data)
            if (message.type === "metadata") {
                const data = message as MailWebSocketMetadataMessage
                this._totalMails.set(data.total_mails)
                this._fetchedMails.set(data.fetched_mails)
                this._isReady.set(true)
            } else if (message.type === "new-mails") {
                const data = message as MailWebSocketNewMailsMessage
                const mails = data.mails.map(mail => new EmailItem(mail))
                if (!this.hasEverLoadedMails) this._emails.set(mails)
                else {
                    const apiMailItemIds: string[] = data.mails.map((m: ApiMailItem) => m.id)
                    this._emails.update(currentMails => {
                        const currentMailsWithOutNewMails = currentMails.filter(mail => !apiMailItemIds.includes(mail.id))
                        return [...currentMailsWithOutNewMails, ...mails].sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
                    })
                }
                this.hasEverLoadedMails = true;
            }
        }

        this.webSocket.onopen = () => {
            if (get(this.fetchedMails) != get(this.emails).length) this.webSocket?.send(JSON.stringify({
                type: "request_next_chunk",
                current_fetched_mails: get(this.emails).length
            }))
        }
    }

    requestNextChunk() {
        if (!this.webSocket || !get(this.isReady) || this.webSocket.readyState !== WebSocket.OPEN) return
        this.webSocket?.send(JSON.stringify({
            type: "request_next_chunk",
        }))
    }

    closeWebSocket() {
        this.webSocket?.close()
        this._fetchedMails.set(0)
    }

    close() {
        this.closeWebSocket()
    }
}

export class EmailItem {
    id: string;
    subject: string | null;
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