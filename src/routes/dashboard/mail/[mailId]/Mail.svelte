<script lang="ts">
    import {EmailSubscription, getEmailSubscription} from "$lib/app/data/mails/mail";
    import {onMount} from "svelte";
    import ToggleGroup from "$lib/components/ToggleGroup.svelte";
    import {AppWindowMac, Text} from "@lucide/svelte";

    let {
        mailId
    }: {
        mailId: string
    } = $props();

    let mailSubscription: EmailSubscription | null = $state(null);
    let subject = $derived.by(() => mailSubscription?.subject);
    let sentBy = $derived.by(() => mailSubscription?.sentBy);
    let sentAt = $derived.by(() => mailSubscription?.sentAt);
    let hasHtmlBody = $derived.by(() => mailSubscription?.hasHtmlBody);
    let textBody = $derived.by(() => mailSubscription?.textBody);

    $effect(() => {
        if (hasHtmlBody) viewMode = "html";
        else viewMode = "text";
    })

    let viewMode: "html" | "text" = $state("html");

    function onNewId(newId: string) {
        mailSubscription = getEmailSubscription(newId)
    }

    $effect(() => {
        if (mailId && mailId != mailSubscription?.emailId) {
            onNewId(mailId);
        }
    })

    onMount(() => {
        onNewId(mailId);
    })
</script>

<div class="flex-col px-8 pt-4 pb-4 h-full">
    {#if mailSubscription?.isReady}
        <h1 class="text-5xl">
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

    {#if hasHtmlBody}
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

    <div class="mt-2 flex-1 h-full overflow-auto">
        {#if viewMode === "html"}
            <iframe src="/api/mail/{mailId}/content/html?raw=true" class="w-full h-full" title={$subject}></iframe>
        {:else if viewMode === "text"}
            <div class="prose prose-sm">
                {#if $textBody}
                    {@html $textBody
                        .replaceAll("<", "&lt\;")
                        .replaceAll(">", "&gt\;")
                        .replaceAll("\n\n", "<p>")
                        .replaceAll("\n", "<br />")}
                {/if}
            </div>
        {/if}
    </div>

</div>
