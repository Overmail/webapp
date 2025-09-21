export interface MailWebSocketMessage {
    type: "metadata";
}

export interface MailWebSocketMetadataMessage extends MailWebSocketMessage {
    type: "metadata";
    total_mails: number;
    fetched_mails: number;
}