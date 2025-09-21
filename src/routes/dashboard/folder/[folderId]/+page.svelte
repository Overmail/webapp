<script lang="ts">
    import {page} from "$app/state";
    import {Folder, getFolderById} from "$lib/app/data/folders";
    import {readable, writable, type Writable} from "svelte/store";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {fade} from "svelte/transition";
    import {Loader} from "@lucide/svelte";
    import {getMailSubscriberForFolder, MailSubscriber,} from "$lib/app/data/mails";
    import Intersector from "./Intersector.svelte";

    let folder: Writable<Folder | null> = writable(null);
    let folderUnsubscriber: () => void;

    let emailSubscription: MailSubscriber | null = $state(null);
    let totalMails = $derived.by(() => emailSubscription?.totalMails ?? readable(0))
    let fetchedEmails = $derived.by(() => emailSubscription?.fetchedMails ?? readable(0))
    let emails = $derived.by(() => emailSubscription?.emails ?? readable([]))
    let isReady = $derived.by(() => emailSubscription?.isReady ?? readable(false))


    let showMailPanel = $state(false);
    let panelOrientation: "horizontal" | "vertical" = $state("horizontal")

    let folderId = $state(page.params.folderId)

    $effect(() => {
        if (page.params.folderId) {
            if (folderId === page.params.folderId) {
                return
            }
            setUp(page.params.folderId)
        }
    })

    function setUp(newFolderId: string) {
        folderUnsubscriber?.();
        folderUnsubscriber = getFolderById(newFolderId, folder).unsubscriber

        emailSubscription?.closeWebSocket()
        emailSubscription = getMailSubscriberForFolder(newFolderId)
        emailSubscription.setupWebSocket();

        folderId = page.params.folderId
    }

    function handleResize() {
        const width = window.innerWidth;
        if (width <= 1080) {
            panelOrientation = "vertical"
        } else {
            panelOrientation = "horizontal"
        }
    }

    function requestNextChunk() {
        emailSubscription?.requestNextChunk()
    }

    onMount(() => {
        handleResize()
        window.addEventListener("resize", handleResize)

        if (page.params.folderId) {
            setUp(page.params.folderId)
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            folderUnsubscriber?.();
            emailSubscription?.closeWebSocket()
        }
    })
</script>

<div class="flex flex-col w-full h-full relative">
    <div class="flex flex-col w-full h-full absolute top-0 left-0 transition-all duration-300" class:opacity-50={!isReady}>
        <div class="flex-col px-8 pt-8 pb-4">
            <h1 class="text-3xl font-bold">
                {$folder?.getDisplayName() ?? $folder?.name}
            </h1>
            <h2 class="text-xl text-gray-700">
                {#if emailSubscription}
                    {#if $totalMails === 1}
                        Eine E-Mail
                    {:else}
                        {$totalMails} E-Mails
                    {/if}
                {/if}
            </h2>
        </div>
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
                                <th class="py-2 h-4 pl-8 w-1/2 text-sm font-semibold bg-white sticky top-0 z-10 text-start">
                                    Betreff
                                </th>
                                <th class="p-2 h-4 w-1/4 text-sm font-semibold bg-white sticky top-0 z-10 text-start">
                                    Von
                                </th>
                                <th class="p-2 h-4 w-1/4 text-sm font-semibold bg-white sticky top-0 z-10 text-start">
                                    Datum
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {#each $emails as email, i(email.id)}
                                <tr
                                        onclick={() => goto(`/dashboard/mail/${email.id}`)}
                                        class="border-t border-t-gray-400 transition-colors duration-150 ease-in-out hover:bg-gray-100 cursor-pointer"
                                >
                                    <td
                                            class="py-1 pl-8 text-sm truncate max-w-xs overflow-hidden whitespace-nowrap"
                                            class:font-bold={!email.isRead}
                                            title={email.subject ?? "Kein Betreff"}
                                    >
                                        {#if !email.subject}
                                            <i>Ohne Betreff</i>
                                        {:else}
                                            {email.subject}
                                        {/if}
                                        <div>
                                            {#if i === Math.max(0, $fetchedEmails - 100)}
                                                <Intersector onIntersect={requestNextChunk}/>
                                            {/if}
                                        </div>

                                    </td>
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
    {#if !isReady}
        <div class="flex flex-col w-full h-full items-center justify-center absolute top-0 left-0 bg-white z-10"
             out:fade>
            <div class="flex flex-col items-center justify-center gap-2">
                <Loader class="w-8 h-8 animate-spin"/>
                <span class="text-sm">Wird geladen</span>
            </div>
        </div>
    {/if}
</div>
