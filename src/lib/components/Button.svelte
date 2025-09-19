<script lang="ts">
    import type {IconProps} from "@lucide/svelte";

    let {
        icon,
        label,
        state,
        type,
        class: className,
        onclick
    }: {
        icon?: import("svelte").Component<IconProps, {}, "">,
        label?: string,
        state?: "enabled" | "disabled" | "loading",
        type: "primary" | "secondary" | "link",
        class?: string,
        onclick?: (e: MouseEvent) => void,
    } = $props();
</script>

<button
        class={`${className || ''} flex flex-row items-center gap-2 px-4 py-3 text-sm min-h-10 rounded-md hover:cursor-pointer button`}
        class:text-white={type === "primary"}
        class:bg-black={type === "primary"}
        class:hover:bg-gray-200={type === "link"}
        disabled={state === "disabled" || state === "loading"}
        onclick={onclick}
>
    {#if icon}
        {@const Icon = icon}
        <Icon size={16} />
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
        transform: scale(0.98);
        transition: all 0.1s ease-in-out;
    }
</style>