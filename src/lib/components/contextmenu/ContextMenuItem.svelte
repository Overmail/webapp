<script lang="ts">
    import type {IconProps} from "@lucide/svelte";
    import type {Snippet} from "svelte";

    let {
        icon,
        iconSnippet,
        label,
        onclick
    }: {
        icon?: import("svelte").Component<IconProps, {}, "">,
        iconSnippet?: Snippet,
        label: string,
        onclick?: () => void,
    } = $props();
</script>

<button
        onclick={onclick}
        class="flex flex-row items-center gap-2 px-2 py-1 min-h-8 cursor-pointer hover:bg-gray-100 rounded-md pressable select-none"
>
    <div class="flex items-center justify-center w-4 h-4">
        {#if icon}
            {@const Icon = icon}
            <Icon class="w-4 h-4" />
        {:else if iconSnippet}
            {@render iconSnippet()}
        {/if}
    </div>
    <div class="text-sm">
        {label}
    </div>
</button>