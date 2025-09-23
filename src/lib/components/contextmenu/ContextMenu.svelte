<script lang="ts">
    import {fade} from "svelte/transition";
    import {calculatePosition} from "$lib/components/contextmenu/ContextMenu";
    import {onMount, type Snippet} from "svelte";

    let {
        isOpen = $bindable(),
        bindToElement,
        children,
    }: {
        isOpen: boolean,
        children?: Snippet,
        bindToElement?: HTMLElement | null
    } = $props();

    let contextMenuRoot = $state<HTMLElement | null>(null);
    let contextMenu = $state<HTMLElement | null>(null);

    let mousePosition = {x: 0, y: 0}
    let contextMenuPosition = $state<{x: number, y: number}>({x: 0, y: 0});
    $effect(() => {
        if (isOpen && contextMenu) {
            // TODO add bindelementrect
            if (bindToElement) contextMenuPosition = calculatePosition(mousePosition, contextMenu.getBoundingClientRect().height);
            else contextMenuPosition = calculatePosition(mousePosition, contextMenu.getBoundingClientRect().height);
        }
    })

    function onMouseMove(event: MouseEvent) {
        mousePosition = {x: event.clientX, y: event.clientY}
    }

    onMount(() => {
        window.addEventListener("mousemove", onMouseMove)

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
        }
    })

    function onClickOutside(event: MouseEvent) {
        if (contextMenu && event.target instanceof Node && event.target === contextMenuRoot) {
            isOpen = false;
        }
    }
</script>

{#if isOpen}
    <div class="absolute w-full h-full top-0 left-0" onclick={onClickOutside} aria-hidden="true" transition:fade={{duration: 150}} bind:this={contextMenuRoot}>
        <div class="absolute ui flex flex-col text-gray-800 gap-1 w-2xs bg-white rounded-lg p-1 shadow-md" bind:this={contextMenu} style="top: {contextMenuPosition.y}px; left: {contextMenuPosition.x}px;">
            {@render children?.()}
        </div>
    </div>
{/if}