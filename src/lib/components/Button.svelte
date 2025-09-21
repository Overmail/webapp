<script lang="ts">
    import type {IconProps} from "@lucide/svelte";

    let {
        icon,
        iconSnippet,
        label,
        state,
        type,
        size,
        class: className,
        onclick
    }: {
        icon?: import("svelte").Component<IconProps, {}, "">,
        iconSnippet?: any,
        label?: string,
        state?: "enabled" | "disabled" | "loading",
        type: "primary" | "secondary" | "link",
        size?: "regular" | "icon"
        class?: string,
        onclick?: (e: MouseEvent) => void,
    } = $props();
</script>

<button
        class={`w-fit ${className || ''} inline-flex flex-row items-center justify-center py-2 gap-2 text-sm min-h-10 rounded-md hover:cursor-pointer button`}
        class:text-white={type === "primary"}
        class:bg-black={type === "primary"}
        class:hover:bg-gray-200={type === "link"}
        class:aspect-square={size === "icon"}
        class:px-2={size === "icon"}
        class:px-4={size !== "icon"}
        disabled={state === "disabled" || state === "loading"}
        onclick={onclick}
>
    {#if icon}
        {@const Icon = icon}
        <Icon size={16} />
    {:else if iconSnippet}
        <div class="aspect-square w-4 h-4 relative flex items-center justify-center">
            {@render iconSnippet()}
        </div>
    {/if}
    {#if label}
        <span class="text-sm font-medium">
            {label}
        </span>
    {/if}
</button>

<style>
    .button {
        transition: all 0.25s ease-in-out;
    }

    .button:active {
        transform: scale(0.96);
        transition: all 0.1s ease-in-out;
    }
</style>