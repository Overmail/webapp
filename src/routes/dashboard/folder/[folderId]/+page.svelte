<script lang="ts">
    import {page} from "$app/state";
    import {Folder, getFolderById} from "$lib/app/data/folders";
    import {writable, type Writable} from "svelte/store";
    import {onMount} from "svelte";
    import {type Email, subscribeToMails} from "$lib/app/data/mails";

    let folder: Writable<Folder | null> = writable(null);
    let folderUnsubscriber: () => void;

    let emails: Writable<Email[]> = writable([]);
    let emailUnsubscriber: () => void;

    let showMailPanel = $state(false);
    let panelOrientation: "horizontal" | "vertical" = $state("horizontal")

    $effect(() => {
        if (page.params.folderId) {
            folderUnsubscriber?.();
            folderUnsubscriber = getFolderById(page.params.folderId, folder).unsubscriber

            emailUnsubscriber?.();
            emailUnsubscriber = subscribeToMails(page.params.folderId, emails)
        }
    })

    function handleResize() {
        const width = window.innerWidth;
        if (width <= 1080) {
            panelOrientation = "vertical"
        } else {
            panelOrientation = "horizontal"
        }
    }

    onMount(() => {
        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize);
            folderUnsubscriber?.();
            emailUnsubscriber?.();
        }
    })
</script>

<div class="flex flex-col w-full h-full">
    <h1 class="text-3xl font-bold px-8 pt-8 pb-4">
        {$folder?.getDisplayName() ?? $folder?.name}
    </h1>
    <div class="flex w-full h-full"
         class:flex-col={panelOrientation === "vertical"}
         class:flex-row={panelOrientation === "horizontal"}
    >
        <div class="flex-1 min-h-0">
            <div class="flex flex-col w-full h-full min-h-0">
                <div class="w-full h-full min-h-0 overflow-y-auto pb-22">
                    <table class="min-w-full">
                        <thead>
                        <tr>
                            <th class="py-2 h-4 pl-8 w-1/2 text-sm font-semibold bg-white sticky top-0 z-10 text-start">Betreff</th>
                            <th class="p-2 h-4 w-1/4 text-sm font-semibold bg-white sticky top-0 z-10 text-start">Von</th>
                            <th class="p-2 h-4 w-1/4 text-sm font-semibold bg-white sticky top-0 z-10 text-start">Datum</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each $emails as email}
                            <tr class="border-t border-t-gray-400">
                                <td
                                        class="py-1 pl-8 text-sm truncate max-w-xs overflow-hidden whitespace-nowrap"
                                        class:font-bold={!email.isRead}
                                        title={email.subject}
                                >{email.subject}</td>
                                <td class="p-1 text-sm truncate max-w-xs overflow-hidden whitespace-nowrap">{email.senderName}</td>
                                <td class="p-1 text-sm truncate max-w-xs overflow-hidden whitespace-nowrap font-mono">
                                    {email.sentAt.toLocaleDateString()}
                                    {email.sentAt.toLocaleTimeString()}
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {#if showMailPanel}
            <div class="flex-1 border-t border-t-gray-400 p-4">Box 2</div>
        {/if}
    </div>

</div>