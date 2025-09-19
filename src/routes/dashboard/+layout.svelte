<script lang="ts">
    import {fade} from "svelte/transition";
    import favicon from "$lib/assets/favicon.svg";
    import {LogOut, Pin} from "@lucide/svelte";
    import {browser} from "$app/environment";

    let { children } = $props();

    let expandDrawer = $state(false);
    let pinDrawer = $state(browser && window.innerWidth > 900);
</script>

<svelte:head>
    <title>Dashboard - Overmail</title>
</svelte:head>

<div class="flex flex-row gap-4 w-full h-full p-4 bg-[#f5f2e9]">
    <div
            class="w-8 transition-all duration-150"
            class:w-72={pinDrawer}
    ></div>

    <div
            aria-label="Expand Drawer"
            role="button"
            tabindex="0"
            class="absolute w-10 top-4 left-2 pl-2 rounded-lg flex flex-col gap-4 items-start justify-start z-10 transition-all duration-150 bg-[#f5f2e9] overflow-x-hidden"
            style="height: calc(100% - 2 * 16px)"
            onmouseenter={() => expandDrawer = true}
            onmouseleave={() => pinDrawer ? null : expandDrawer = false}
            class:w-56={expandDrawer || pinDrawer}
            class:pr-2={expandDrawer || pinDrawer}
            class:shadow-lg={expandDrawer && !pinDrawer}
    >
        <div class="flex flex-col gap-4 mt-2 items-center overflow-clip w-full">
            <img src={favicon} alt="Overmail Logo" class="w-8 h-8" />
            {#if expandDrawer || pinDrawer}
                <div class="text-2xl font-bold" transition:fade={{ duration: 100 }}>
                    Overmail
                </div>
            {/if}
        </div>

        <div class="flex flex-col flex-1 gap-4">
            <!-- Drawer content -->
        </div>

        <div class="flex flex-col gap-1 mb-2 w-full">
            <button
                    onclick={() => pinDrawer = !pinDrawer}
                    class="flex flex-row items-center justify-start overflow-hidden gap-2 py-2 px-2 transition-colors rounded-lg w-full hover:bg-[#eae0c9] cursor-pointer"
            >
                <Pin class="w-4 h-4 shrink-0" />
                <span class="shrink whitespace-nowrap overflow-hidden text-clip">Menü Pinnen</span>
            </button>
            <button
                    onclick={() => window.location.href = "/api/auth/logout"}
                    class="flex flex-row items-center justify-start overflow-hidden gap-2 py-2 px-2 transition-colors rounded-lg w-full hover:bg-[#eae0c9] cursor-pointer"
            >
                <LogOut class="w-4 h-4 shrink-0" />
                <span class="shrink">Logout</span>
            </button>
        </div>
    </div>

    <div class="w-full h-full bg-[#ffffff] rounded-lg shadow-lg p-5">
        {@render children?.()}
    </div>
</div>

{#if expandDrawer && !pinDrawer}
    <div
            class="w-full h-full bg-[#00000020] backdrop-blur-xs absolute top-0 left-0 p-4"
            transition:fade={{ duration: 150 }}
    ></div>
{/if}
