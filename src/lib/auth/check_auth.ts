export default async function(): Promise<boolean> {
    const response = await fetch("/api/auth/check", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    return response.ok;
}