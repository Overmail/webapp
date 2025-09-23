<script lang="ts">
    import {EmailSubscription, getEmailSubscription} from "$lib/app/data/mails/mail";
    import {onMount} from "svelte";
    import ToggleGroup from "$lib/components/ToggleGroup.svelte";
    import {AppWindowMac, ArrowLeft, ChevronDown, Mail, MailOpen, RotateCw, Text, Trash2} from "@lucide/svelte";
    import Button from "$lib/components/Button.svelte";
    import {get} from "svelte/store";
    import {requestMailRefresh, setRead} from "$lib/app/data/mails/functions";
    import Metadata from "./_mail-page/Metadata.svelte";
    import ContextMenu from "$lib/components/contextmenu/ContextMenu.svelte";
    import ContextMenuItem from "$lib/components/contextmenu/ContextMenuItem.svelte";

    let {
        mailId,
        onBack
    }: {
        mailId: string,
        onBack?: () => void,
    } = $props();

    let mailSubscription: EmailSubscription | null = $state(null);
    let subject = $derived.by(() => mailSubscription?.subject);
    let sentBy = $derived.by(() => mailSubscription?.sentBy);
    let sentTo = $derived.by(() => mailSubscription?.sentTo);
    let sentAt = $derived.by(() => mailSubscription?.sentAt);
    let hasHtmlBody = $derived.by(() => mailSubscription?.hasHtmlBody);
    let textBody = $derived.by(() => mailSubscription?.textBody);
    let isRead = $derived.by(() => mailSubscription?.isRead);
    let htmlIframe: HTMLIFrameElement | null = $state(null);

    let expandMetadata = $state(false);

    let htmlBodyStateUnsubscriber: (() => void) | null = null;

    let viewMode: "html" | "text" = $state("html");

    function onIframeMessage(event: MessageEvent) {
        if (event.data.type === 'resize' && htmlIframe) {
            htmlIframe.style.height = event.data.height + 'px';
        }
    }

    function onNewId(newId: string) {
        htmlBodyStateUnsubscriber?.();
        expandMetadata = false;
        mailSubscription = getEmailSubscription(newId)
        htmlBodyStateUnsubscriber = mailSubscription.hasHtmlBody.subscribe((hasHtmlBody) => {
            if (hasHtmlBody) viewMode = "html";
            else viewMode = "text";
        })

        mailSubscription.onReady().then((sub) => {
            const isRead = get(sub.isRead);
            if (!isRead) {
                setRead(newId, true);
            }
        })
    }

    onMount(() => {
        onNewId(mailId);
        window.addEventListener("message", onIframeMessage);
        return () => {
            window.removeEventListener("message", onIframeMessage);
        }
    })

    let showExtraContextMenu = $state(false);
    let showExtraContentMenuButton: HTMLButtonElement | undefined = $state()
</script>

<div class="flex flex-row items-center justify-between pt-4 px-4">
    <Button
            class="shrink"
            icon={ArrowLeft}
            onclick={onBack}
            label="Zurück"
            size="default"
            state="default"
            variant="link"
    />
    <div class="flex flex-row items-center gap-1 shrink">
        <Button
                size="icon"
                icon={Trash2}
                onclick={() => {}}
                state="default"
                variant="link"
        />
        <Button
                size="icon"
                icon={!$isRead ? Mail : MailOpen}
                onclick={() => {
                    if (!mailSubscription) return;
                    setRead(mailId, !$isRead);
                }}
                state="default"
                variant="link"
        />
    </div>
</div>

<div class="flex flex-col px-6 pt-2 flex-1 overflow-y-auto">
    {#if mailSubscription?.isReady}
        <h1 class="text-3xl flex flex-row gap-2 flex-wrap" class:font-bold={!$isRead}>
            {#if $subject == null}
                <i>Ohne Betreff</i>
            {:else}
                {$subject}
            {/if}

            <Button
                    variant="link"
                    size="icon"
                    bind:buttonBinding={showExtraContentMenuButton}
                    onclick={() => showExtraContextMenu = true}
            >
                {#snippet iconSnippet()}
                    <div class="w-4 h-4 transition-all duration-150" class:rotate-180={showExtraContextMenu}>
                        <ChevronDown class="w-4 h-4"/>
                    </div>
                {/snippet}
            </Button>

            <ContextMenu
                bindToElement={showExtraContentMenuButton}
                bind:isOpen={showExtraContextMenu}
            >
                <ContextMenuItem
                        onclick={() => { requestMailRefresh(mailId) }}
                        icon={RotateCw}
                        label="Auf Server aktualisieren"/>
            </ContextMenu>
        </h1>
        <Metadata
                sentBy={$sentBy ?? ""}
                sentTo={$sentTo ?? []}
                sentAt={$sentAt ?? new Date()}
                bind:expandMetadata={expandMetadata}
        />
    {/if}

    {#if $hasHtmlBody}
        <div class="mt-2">
            <ToggleGroup
                    active={[viewMode]}
                    options={[
                        {
                            id: "text",
                            label: "Text",
                            icon: Text,
                            onClick: () => { viewMode = "text" }
                        },
                        {
                            id: "html",
                            label: "HTML",
                            icon: AppWindowMac,
                            onClick: () => { viewMode = "html" }
                      }
                    ]}
            />
        </div>
    {/if}

    <div class="flex flex-col grow mt-2">
        {#if viewMode === "html"}
            <iframe
                    src="/api/mails/{mailId}/content/html?raw=true"
                    class="w-full flex grow min-h-72"
                    title={$subject}
                    bind:this={htmlIframe}
            ></iframe>
        {:else if viewMode === "text"}
            <div class="prose prose-sm serif">
                {#if $textBody}
                    {@html $textBody
                        .replaceAll("\n\n", "<p>")
                        .replaceAll("\n", "<br />")}
                {/if}
            </div>
        {/if}
    </div>
</div>
