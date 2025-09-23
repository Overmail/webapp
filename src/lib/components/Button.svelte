<script lang="ts">
    import type {IconProps} from "@lucide/svelte";
    import type {HTMLButtonAttributes} from "svelte/elements";
    import type {Snippet} from "svelte";

    export type ButtonProps = {
        icon?: import("svelte").Component<IconProps, {}, "">,
        iconSnippet?: Snippet,
        label?: string,
        state?: "default" | "disabled" | "loading",
        variant: "primary" | "link",
        size: "default" | "icon",
        className?: string,
        buttonBinding?: HTMLButtonElement | undefined,
    } & HTMLButtonAttributes;

    let {
        icon,
        iconSnippet,
        label,
        state,
        variant: type,
        size,
        class: className,
        buttonBinding = $bindable<HTMLButtonElement>(),
        ...restProps
    }: ButtonProps = $props();
</script>

<button
        class={`w-fit ${className || ''} inline-flex flex-row items-center justify-center py-2 gap-2 text-sm min-h-10 rounded-md hover:cursor-pointer pressable`}
        class:text-white={type === "primary"}
        class:bg-black={type === "primary"}
        class:hover:bg-gray-200={type === "link"}
        class:aspect-square={size === "icon"}
        class:px-2={size === "icon"}
        class:px-4={size !== "icon"}
        disabled={state === "disabled" || state === "loading"}
        bind:this={buttonBinding}
        {...restProps}
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