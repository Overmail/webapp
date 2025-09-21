<script lang="ts">
    import type {IconProps} from "@lucide/svelte";

    let {
        options,
        active,
        class: className
    }: {
        options: {
            id: string,
            icon?: import("svelte").Component<IconProps, {}, "">,
            label: string,
            onClick: () => void
        }[],
        active: string[],
        class?: string,
    } = $props();
</script>

<div class={`${className ?? ""} w-fit flex flex-row gap-1 border border-gray-300 rounded-md p-1`}>
    {#each options as option}
        {@const isActive = active.includes(option.id)}
        <button
            class="flex flex-row items-center justify-center gap-2 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100 hover:text-gray-700 text-sm transition-colors duration-150"
            class:bg-gray-800={isActive}
            class:hover:bg-gray-700={isActive}
            class:hover:text-zinc-200={isActive}
            class:text-zinc-100={isActive}
            onclick={option.onClick}
        >
            {#if option.icon}
                {@const Icon = option.icon}
                <Icon class="w-4 h-4" />
            {/if}
            {option.label}
        </button>
    {/each}
</div>