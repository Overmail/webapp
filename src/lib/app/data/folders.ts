import {type Writable, writable} from "svelte/store";
import {Archive, type IconProps, Inbox, Pen, Send, Shredder, Trash, Folder as FolderIcon} from "@lucide/svelte";

let webSocket: WebSocket | null = null;

let folders: Writable<ApiFolder[]> = writable([])

export let folderTree: Writable<Folder[]> = writable([])

function connectWebSocket() {
    webSocket?.close()

    let hadSuccess = false;

    try {
        webSocket = new WebSocket("/api/webapp/realtime/folder")
    } catch (e) {
        console.error("Failed to connect to WebSocket", e);
        setTimeout(connectWebSocket, 1000);
        return
    }

    webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "new-folders") {
            console.log("New folder", data.folders)

            if (!hadSuccess) folders.set(data.folders)
            else {
                const apiFolderIds: string[] = data.folders.map((f: ApiFolder) => f.id)
                folders.update(currentFolders => {
                    const currentFoldersWithOutNewFolders = currentFolders.filter(f => !apiFolderIds.includes(f.id))
                    return [...currentFoldersWithOutNewFolders, ...data.folders]
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
            setTimeout(connectWebSocket, 1000);
        }
    }
}

export function getFolderById(id: string, folderStore: Writable<Folder | null>): {
    unsubscriber: () => void;
} {
    function findFolderById(folders: Folder[], id: string): Folder | null {
        for (const folder of folders) {
            if (folder.id === id) {
                return folder;
            }
            const found = findFolderById(folder.children, id);
            if (found) {
                return found;
            }
        }
        return null;
    }
    const unsubscriber = folderTree.subscribe((folders) => {
        folderStore.set(findFolderById(folders, id));
    });
    return { unsubscriber };
}

export function subscribeToFolders(): () => void {
    connectWebSocket();

    const unsubscriber = folders.subscribe((apiFolders) => {
        // Umwandlung der ApiFolder-Liste in eine Baumstruktur mit nur Root-Elementen
        const folderMap = new Map<string, Folder>();
        apiFolders.forEach(apiFolder => {
            folderMap.set(apiFolder.id, new Folder(apiFolder));
        });

        const roots: Folder[] = [];
        folderMap.forEach(folder => {
            const apiFolder = apiFolders.find(f => f.id === folder.id)!
            console.log("Folder", apiFolder)
            if (apiFolder?.parent_id === null) {
                roots.push(folder);
            } else {
                const parentFolder = folderMap.get(apiFolder.parent_id);
                if (parentFolder) {
                    folder.setParent(parentFolder);
                }
            }
        });

        folderTree.set(roots);
    });

    return () => {
        webSocket?.close()
        unsubscriber();
    }
}

interface ApiFolder {
    id: string;
    name: string;
    parent_id: string | null;
    unread_count: number;
}

export class Folder {
    id: string;
    name: string;
    parent: Folder | null;
    children: Folder[] = [];
    unreadCount: number

    constructor(folder: ApiFolder) {
        this.id = folder.id;
        this.name = folder.name;
        this.parent = null;
        this.unreadCount = folder.unread_count;
    }

    addChild(child: Folder) {
        this.children.push(child);
    }

    setParent(parent: Folder) {
        this.parent = parent;
        parent.addChild(this);
    }

    getDisplayName(): string | null {
        if (this.name.toLowerCase() === "inbox") return "Posteingang"
        if (this.name.toLowerCase() === "sent" || this.name.toLowerCase() === "sent items") return "Gesendet"
        if (this.name.toLowerCase() === "trash") return "Papierkorb"
        if (this.name.toLowerCase() === "drafts") return "Entwürfe"

        return  null;
    }

    getIcon(): import("svelte").Component<IconProps, {}, ""> {
        if (this.name.toLowerCase() === "inbox") return Inbox
        if (this.name.toLowerCase() === "sent" || this.name.toLowerCase() === "sent items") return Send
        if (this.name.toLowerCase() === "trash") return Trash
        if (this.name.toLowerCase() === "drafts") return Pen
        if (this.name.toLowerCase() === "spam") return Shredder
        if (this.name.toLowerCase() === "archive") return Archive

        return FolderIcon
    }
}