import {readable, writable} from "svelte/store";

interface WebSocketEmailMessage {
    type: "metadata";
}

interface WebSocketEmailMetadataMessage extends WebSocketEmailMessage {
    type: "metadata";
    subject: string;
    sent_at: number;
    sent_by: string;
    has_html_body: boolean;
}

const emailSubscriptions: Map<string, EmailSubscription> = new Map();

export function getEmailSubscription(emailId: string): EmailSubscription {
    if (emailSubscriptions.has(emailId)) {
        return emailSubscriptions.get(emailId)!;
    }

    const subscription = new EmailSubscription(emailId);
    emailSubscriptions.set(emailId, subscription);
    return subscription;
}

export class EmailSubscription {

    private _isReady = writable(false);
    isReady = readable(false, (set) => {
        this._isReady.subscribe(set)
    })
    readonly emailId: string;
    private _subject = writable<string | null>("")
    subject = readable<string | null>("", (set) => {
        this._subject.subscribe(set)
    })

    private _sentAt = writable<Date>(new Date())
    sentAt = readable<Date>(new Date(), (set) => {
        this._sentAt.subscribe(set)
    })

    private _sentBy = writable<string | null>(null)
    sentBy = readable<string | null>(null, (set) => {
        this._sentBy.subscribe(set)
    })

    private _hasHtmlBody = writable<boolean>(false)
    hasHtmlBody = readable<boolean>(false, (set) => {
        this._hasHtmlBody.subscribe(set)
    })

    private _textBody = writable<string>("")
    textBody = readable<string>("", (set) => {
        this._textBody.subscribe(set)
    })

    private webSocket: WebSocket | null = null;

    constructor(emailId: string) {
        this.emailId = emailId;
        this.setupWebSocket()

        fetch("/api/mail/" + emailId + "/content/text").then(response => {
            if (response.ok) {
                response.json().then(text => {
                    this._textBody.set(text.text)
                })
            } else {
                console.error("Failed to fetch text body for email", emailId);
            }
        })
    }

    setupWebSocket() {
        if (this.webSocket?.readyState === WebSocket.OPEN) return;
        if (this.webSocket?.readyState === WebSocket.CONNECTING) return;
        console.log("Setting up WebSocket for mail", this.emailId)
        this.closeWebSocket()

        this.webSocket = new WebSocket(`/api/webapp/realtime/mail/${this.emailId}`)

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
            const data: WebSocketEmailMessage = JSON.parse(event.data)
            if (data.type === "metadata") {
                const metadataMessage = data as WebSocketEmailMetadataMessage
                this._subject.set(metadataMessage.subject)
                this._sentAt.set(new Date(metadataMessage.sent_at * 1000))
                this._sentBy.set(metadataMessage.sent_by)
                this._hasHtmlBody.set(metadataMessage.has_html_body)
                this._isReady.set(true)
            }
        }
    }

    closeWebSocket() {
        this.webSocket?.close()
    }

    close() {
        this.closeWebSocket()
    }
}