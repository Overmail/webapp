<script lang="ts">
    import type {IconProps} from "@lucide/svelte";

    let {
        icon,
        title,
        body
    }: {
        icon: import("svelte").Component<IconProps, {}, "">,
        title: string,
        body: any
    } = $props();
</script>

<div class="flex flex-col gap-1">
    <div class="flex flex-row items-center gap-2">
        {#if icon}
            {@const Icon = icon}
            <Icon class="w-4 h-4" />
        {/if}
        <span class="text-sm font-semibold">{title}</span>
    </div>
    {@render body()}
</div>