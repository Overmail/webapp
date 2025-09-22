<script lang="ts">
    import {ArrowRight, ChevronDown} from "@lucide/svelte";
    import Button from "$lib/components/Button.svelte";
    import type {Recipient} from "$lib/app/data/mails/mail";
    import {slide, type TransitionConfig} from "svelte/transition";
    import TableRecipientRow from "./TableRecipientRow.svelte";

    let metadataTransition: TransitionConfig = {
        duration: 150
    }

    let {
        sentBy,
        sentTo,
        sentAt,
        expandMetadata = $bindable()
    }: {
        sentBy: string | null,
        sentTo: Recipient[],
        sentAt: Date,
        expandMetadata: boolean,
    } = $props();
</script>

<div class="flex flex-rows gap-2 p-4 mt-2 rounded-md border border-gray-300">
    <div class="flex flex-col grow">
        <h2 class="text-sm flex flex-col items-start">
            <span class="inline-flex flex-nowrap text-nowrap whitespace-nowrap">{sentBy}</span>
            {#if !expandMetadata}
                <span class="inline-flex items-start flex-wrap" transition:slide={{...metadataTransition, axis: "y"}}>
                    {#if sentTo}
                        <span>
                            <ArrowRight class="inline-block w-3 h-3"/>
                            {#if sentTo.some(to => to.is_me)}
                                dich{#if sentTo.length > 1},{/if}
                            {:else}
                                {sentTo[0]?.name}{#if sentTo.length > 1},{/if}
                            {/if}
                        </span>
                        {#if sentTo.length === 2}
                            <span>+ ein weiterer</span>
                        {:else if sentTo.length > 2}
                            <span>+ {sentTo.length - 1} weitere</span>
                        {/if}
                    {/if}
                </span>
            {/if}
        </h2>
        {#if expandMetadata}
            <div class="flex flex-row" transition:slide={{...metadataTransition, axis: "y"}}>
                <table class="table-auto w-full text-sm serif">
                    <tbody>
                    {#if sentTo}
                        {@const to = sentTo.filter(to => to.type === "to")}
                        {#if to.length > 0}
                            <TableRecipientRow recipients={to} type="to" />
                        {/if}
                        {@const cc = sentTo.filter(to => to.type === "cc")}
                        {#if cc.length > 0}
                            <TableRecipientRow recipients={cc} type="cc" />
                        {/if}
                        {@const bcc = sentTo.filter(to => to.type === "bcc")}
                        {#if bcc.length > 0}
                            <TableRecipientRow recipients={bcc} type="bcc" />
                        {/if}
                    {/if}
                    </tbody>
                </table>
            </div>
        {/if}
        <h2 class="text-sm">
            {sentAt.toLocaleString()}
        </h2>
    </div>
    <div class="flex flex-row items-center shrink self-start">
        <!--suppress JSUnusedGlobalSymbols -->
        <Button
                type="link"
                size="icon"
                onclick={() => expandMetadata = !expandMetadata}
        >
            {#snippet iconSnippet()}
                <div class="w-4 h-4 transition-all duration-150" class:rotate-180={expandMetadata}>
                    <ChevronDown class="w-4 h-4"/>
                </div>
            {/snippet}
        </Button>
    </div>
</div>