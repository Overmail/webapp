export async function setRead(mailId: string, read: boolean) {
    await fetch(`/api/mails/${mailId}/read`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            is_read: read
        })
    })
}

export async function requestMailRefresh(mailId: string) {
    await fetch(`/api/mails/${mailId}/refresh`, {
        method: "POST"
    })
}