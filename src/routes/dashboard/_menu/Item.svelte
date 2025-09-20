<script lang="ts">
    import {fade} from "svelte/transition";
    import {type IconProps} from "@lucide/svelte";

    let {
        icon,
        title,
        subtitle,
        suffix,
        showSuffix,
        hasDot,
        onclick,
        slim,
        active,
        class: classList
    }: {
        icon: import("svelte").Component<IconProps, {}, "">,
        title: string,
        subtitle?: string,
        suffix?: string,
        showSuffix?: boolean,
        hasDot?: boolean,
        onclick: () => void,
        slim?: boolean,
        active?: boolean,
        classList?: string
    } = $props();

</script>

<button
        onclick={onclick}
        class={`flex flex-row items-center justify-start text-xs overflow-hidden gap-2 p-2 transition-colors rounded-lg w-full hover:bg-[#eae0c9] cursor-pointer ${classList ?? ""}`}
        class:bg-[#eae0c9]={active}
        class:h-10={!slim}
>
    {#if icon}
        {@const Icon = icon}
        <div class="w-4 h-4 shrink-0 relative">
            <Icon class="w-4 h-4 shrink-0"/>
            {#if hasDot}
                <div class="w-2 h-2 rounded-full bg-green-700 absolute top-[-4px] right-[-4px]" transition:fade></div>
            {/if}
        </div>
    {/if}

    <span class="flex flex-row gap-2 items-baseline w-full">
        <span class="flex flex-row gap-2 items-baseline flex-1">
            <span class="shrink text-clip text-nowrap whitespace-nowrap">{title}</span>
            {#if subtitle}
            <span class="shrink text-clip text-nowrap whitespace-nowrap text-xs text-gray-500">{subtitle}</span>
        {/if}
        </span>
        {#if suffix && showSuffix}
            <span class="text-clip text-nowrap whitespace-nowrap text-xs text-gray-500" transition:fade>{suffix}</span>
        {/if}
    </span>
</button>