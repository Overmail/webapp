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
        window.addEventListener("mousedown", onClick)


        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mousedown", onClick)
        }
    })

    function onClick(event: MouseEvent) {
        if (isOpen && event.target instanceof HTMLElement && event.target.closest(".context-menu-item") === null) {
            isOpen = false;
        }
    }
</script>

{#if isOpen}
    <div class="absolute w-full h-full top-0 left-0 z-30 pointer-events-none" aria-hidden="true" transition:fade={{duration: 150}} bind:this={contextMenuRoot}>
        <div class="absolute ui flex flex-col text-gray-800 gap-1 w-2xs pointer-events-auto bg-white rounded-lg p-1 shadow-md" bind:this={contextMenu} style="top: {contextMenuPosition.y}px; left: {contextMenuPosition.x}px;">
            {@render children?.()}
        </div>
    </div>
{/if}