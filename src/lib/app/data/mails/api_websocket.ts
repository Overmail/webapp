export interface MailWebSocketMessage {
    type: "metadata" | "new-mails";
}

export interface MailWebSocketMetadataMessage extends MailWebSocketMessage {
    type: "metadata";
    total_mails: number;
    fetched_mails: number;
}

export interface ApiMailItem {
    id: string;
    subject: string | null;
    from: string;
    sent_at: number;
    is_read: boolean;
    has_attachments: boolean;
    preview_text: string;
}

export interface MailWebSocketNewMailsMessage extends MailWebSocketMessage {
    type: "new-mails";
    mails: ApiMailItem[];
}