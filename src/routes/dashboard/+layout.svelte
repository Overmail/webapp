<script lang="ts">
    import {fade, slide} from "svelte/transition";
    import favicon from "$lib/assets/favicon.svg";
    import {Home, LogOut, Menu, Pin, X} from "@lucide/svelte";
    import {browser} from "$app/environment";
    import Item from "./_menu/Item.svelte";
    import {onMount} from "svelte";
    import {folderTree, subscribeToFolders} from "$lib/app/data/folders";
    import {goto} from "$app/navigation";
    import {page} from "$app/state";
    import Folder from "./_menu/Folder.svelte";

    let { children } = $props();

    let expandDrawer = $state(false);

    let isPinChanged = $state(false);
    let pinDrawer = $state(browser && window.innerWidth > 900);

    let isDrawerExpanded = $derived(expandDrawer || pinDrawer);

    let isMobile = $state(false)
    function handleResize() {
        isMobile = window.innerWidth < 900;
        if (!isPinChanged) pinDrawer = !isMobile;
    }

    onMount(() => {
        const cleanUp = subscribeToFolders();
        window.addEventListener("resize", handleResize);

        return () => {
            cleanUp();
            window.removeEventListener("resize", handleResize);
        }
    })

    function onMenuMouseEnter() {
        if (pinDrawer) return
        expandDrawer = true
    }

    function onMenuMouseLeave() {
        if (pinDrawer) return
        if (isDrawerExpanded) expandDrawer = false
    }

    function togglePin() {
        pinDrawer = !pinDrawer;
        isPinChanged = true;
    }
</script>

<svelte:head>
    <title>Dashboard - Overmail</title>
</svelte:head>

<div class="flex flex-row gap-4 w-full h-full p-4 bg-[#f5f2e9]">
    <div
            class="w-8 transition-all duration-150"
            class:w-68={pinDrawer}
    ></div>

    <div
            class="absolute top-0 left-0 w-fit h-full flex px-2 duration-150 transition-all"
            class:py-2={isDrawerExpanded}
            class:w-full={expandDrawer}
            class:py-4={!isDrawerExpanded}
    >
        <div
                aria-label="Expand Drawer"
                role="button"
                tabindex="0"
                class="h-full w-10 pl-2 rounded-lg flex flex-col items-start justify-start z-20 transition-all duration-150 bg-[#f5f2e9] overflow-x-hidden"
                onmouseenter={onMenuMouseEnter}
                onmouseleave={onMenuMouseLeave}
                class:w-full={isDrawerExpanded}
                class:sm:w-56={isDrawerExpanded}
                class:pr-2={isDrawerExpanded}
                class:py-2={isDrawerExpanded}
                class:shadow-lg={expandDrawer && !pinDrawer}
        >
            <div class="mt-2 w-full">
                {#if !pinDrawer}
                    <div transition:slide={{ duration: 150, axis: "y" }}>
                        <Item
                                slim={true}
                                icon={expandDrawer ? X : Menu}
                                onclick={() => expandDrawer = !expandDrawer}
                                title="Menü einklappen" />
                    </div>
                {/if}
            </div>

            <div class="flex flex-row gap-2 items-center overflow-clip w-full">
                <img src={favicon} alt="Overmail Logo" class="w-8 h-8" />
                {#if expandDrawer || pinDrawer}
                    <div class="text-lg font-bold" transition:fade={{ duration: 100 }}>
                        Overmail
                    </div>
                {/if}
            </div>

            <div class="flex flex-col flex-1 gap-1 mt-2 w-full overflow-y-auto no-scrollbar">
                <!-- Drawer content -->
                <Item
                        class="mb-4"
                        active={page.url.pathname === "/dashboard"}
                        slim={true}
                        icon={Home}
                        onclick={() => {expandDrawer = false; goto("/dashboard")}}
                        title="Dashboard" />

                {#each $folderTree as folder}
                    <Folder
                            isDrawerOpen={isDrawerExpanded}
                            folder={folder}
                            onclick={() => expandDrawer = false}
                    />
                {/each}
            </div>

            <div class="flex flex-col gap-1 mb-2 w-full">
                <Item
                        class="hidden sm:flex"
                        onclick={togglePin}
                        title="Menü Pinnen"
                        icon={Pin} />

                <Item
                        onclick={() => window.location.href = "/api/auth/logout"}
                        title="Abmelden"
                        icon={LogOut} />
            </div>
        </div>
    </div>

    <div class="w-full h-full bg-[#ffffff] rounded-lg shadow-lg overflow-hidden">
        {@render children?.()}
    </div>
</div>

{#if expandDrawer && !pinDrawer}
    <div
            class="w-full h-full bg-[#00000020] backdrop-blur-xs absolute top-0 left-0 p-4 z-10"
            transition:fade={{ duration: 150 }}
    ></div>
{/if}
