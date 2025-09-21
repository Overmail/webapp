<script lang="ts">
    import {EmailSubscription, getEmailSubscription} from "$lib/app/data/mails/mail";
    import {onMount} from "svelte";
    import ToggleGroup from "$lib/components/ToggleGroup.svelte";
    import {AppWindowMac, ArrowLeft, Mail, MailOpen, Text, Trash2} from "@lucide/svelte";
    import Button from "$lib/components/Button.svelte";
    import {get} from "svelte/store";
    import {setRead} from "$lib/app/data/mails/functions";

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
    let sentAt = $derived.by(() => mailSubscription?.sentAt);
    let hasHtmlBody = $derived.by(() => mailSubscription?.hasHtmlBody);
    let textBody = $derived.by(() => mailSubscription?.textBody);
    let isRead = $derived.by(() => mailSubscription?.isRead);

    let htmlBodyStateUnsubscriber: (() => void) | null = null;

    let viewMode: "html" | "text" = $state("html");

    function onNewId(newId: string) {
        htmlBodyStateUnsubscriber?.();
        mailSubscription = getEmailSubscription(newId)
        htmlBodyStateUnsubscriber = mailSubscription.hasHtmlBody.subscribe((hasHtmlBody) => {
            if (hasHtmlBody) viewMode = "html";
            else viewMode = "text";
        })

        mailSubscription.onReady().then((sub) => {
            const isRead = get(sub.isRead);
            if(!isRead) {
                setRead(newId, true);
            }
        })
    }

    onMount(() => {
        console.log("mounting mail", mailId);
        onNewId(mailId);
    })
</script>

<div class="flex flex-row items-center justify-between pt-4 px-4">
    <Button
            class="shrink"
            icon={ArrowLeft}
            onclick={onBack}
            label="Zurück"
            state="enabled"
            type="link"
    />
    <div class="flex flex-row items-center gap-1 shrink">
        <Button
                size="icon"
                icon={Trash2}
                onclick={onBack}
                state="enabled"
                type="link"
        />
        <Button
                size="icon"
                icon={!$isRead ? Mail : MailOpen}
                onclick={() => {
                    if (!mailSubscription) return;
                    setRead(mailId, !$isRead);
                }}
                state="enabled"
                type="link"
        />
    </div>
</div>

<div class="flex flex-col px-6 pt-2 flex-1 overflow-y-auto">
    {#if mailSubscription?.isReady}
        <h1 class="text-3xl" class:font-bold={!$isRead}>
            {#if $subject == null}
                <i>Ohne Betreff</i>
            {:else}
                {$subject}
            {/if}
        </h1>
        <h2 class="text-sm">
            {#if $sentBy}
                {$sentBy}
            {/if}
            {#if $sentBy && $sentAt}
                &bullet;
            {/if}
            {#if $sentAt}
                {$sentAt.toLocaleString()}
            {/if}
        </h2>
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
            <iframe src="/api/mails/{mailId}/content/html?raw=true" class="w-full flex grow" title={$subject}></iframe>
        {:else if viewMode === "text"}
            <div class="prose prose-sm">
                {#if $textBody}
                    {@html $textBody
                        .replaceAll("\n\n", "<p>")
                        .replaceAll("\n", "<br />")}
                {/if}
            </div>
        {/if}
    </div>
</div>
