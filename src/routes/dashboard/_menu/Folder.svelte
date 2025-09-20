<script lang="ts">
    import {page} from "$app/state";
    import Folder from "./Folder.svelte";
    import Item from "./Item.svelte";

    let {
        folder,
        onclick
    }: {
        folder: Folder,
        onclick?: () => void,
    } = $props();

</script>

<div class="flex flex-col">
    <Item
            active={page.url.pathname.startsWith(`/dashboard/folder/${folder.id}`)}
            slim={true}
            suffix={folder.unreadCount > 0 ? folder.unreadCount.toString() : undefined}
            showSuffix={folder.unreadCount > 0 && (expandDrawer || pinDrawer)}
            hasDot={folder.unreadCount > 0}
            icon={folder.getIcon()}
            onclick={onclick}
            title={folder.getDisplayName() ?? folder.name}
            subtitle={folder.getDisplayName() ? folder.name : undefined}
    />
    {#if folder.children.length > 0}
        <div class="flex flex-col gap-2 mt-2 ml-2">
            {#each folder.children as subFolder}
                <Folder folder={subFolder} onclick={onclick} />
            {/each}
        </div>
    {/if}
</div>
