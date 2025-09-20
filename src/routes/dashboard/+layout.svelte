<script lang="ts">
    import {fade, slide} from "svelte/transition";
    import favicon from "$lib/assets/favicon.svg";
    import {Home, LogOut, Menu, Pin, X} from "@lucide/svelte";
    import {browser} from "$app/environment";
    import Item from "./_menu/Item.svelte";
    import {onMount} from "svelte";
    import {folderTree, subscribeToFolders} from "./data/folders";
    import {goto} from "$app/navigation";
    import {page} from "$app/state";

    let { children } = $props();

    let expandDrawer = $state(false);
    let pinDrawer = $state(browser && window.innerWidth > 900);

    onMount(() => {
        const cleanUp = subscribeToFolders();

        return () => {
            cleanUp();
        }
    })
</script>

<svelte:head>
    <title>Dashboard - Overmail</title>
</svelte:head>

<div class="flex flex-row gap-4 w-full h-full p-4 bg-[#f5f2e9]">
    <div
            class="w-8 transition-all duration-150"
            class:w-74={pinDrawer}
    ></div>

    <div
            class="absolute top-0 left-0 w-full h-full flex px-2 transition-all duration-150"
            class:py-2={expandDrawer || pinDrawer}
            class:py-4={!(expandDrawer || pinDrawer)}
    >
        <div
                aria-label="Expand Drawer"
                role="button"
                tabindex="0"
                class="h-full w-10 pl-2 rounded-lg flex flex-col items-start justify-start z-10 transition-all duration-150 bg-[#f5f2e9] overflow-x-hidden"
                onmouseenter={() => expandDrawer = true}
                onmouseleave={() => pinDrawer ? null : expandDrawer = false}
                class:w-full={expandDrawer || pinDrawer}
                class:sm:w-56={expandDrawer || pinDrawer}
                class:pr-2={expandDrawer || pinDrawer}
                class:py-2={expandDrawer || pinDrawer}
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

            <div class="flex flex-col flex-1 gap-1 mt-2 w-full">
                <!-- Drawer content -->
                <Item
                        class="mb-4"
                        active={page.url.pathname === "/dashboard"}
                        slim={true}
                        icon={Home}
                        onclick={() => goto("/dashboard")}
                        title="Dashboard" />

                {#each $folderTree as folder}
                    <Item
                            active={page.url.pathname.startsWith(`/dashboard/folder/${folder.id}`)}
                            slim={true}
                            suffix={folder.unreadCount > 0 ? folder.unreadCount.toString() : undefined}
                            showSuffix={folder.unreadCount > 0 && (expandDrawer || pinDrawer)}
                            hasDot={folder.unreadCount > 0}
                            icon={folder.getIcon()}
                            onclick={() => goto(`/dashboard/folder/${folder.id}`)}
                            title={folder.getDisplayName() ?? folder.name}
                            subtitle={folder.getDisplayName() ? folder.name : undefined}
                    />
                {/each}
            </div>

            <div class="flex flex-col gap-1 mb-2 w-full">
                <Item
                        class="hidden sm:flex"
                        onclick={() => pinDrawer = !pinDrawer}
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
            class="w-full h-full bg-[#00000020] backdrop-blur-xs absolute top-0 left-0 p-4"
            transition:fade={{ duration: 150 }}
    ></div>
{/if}
