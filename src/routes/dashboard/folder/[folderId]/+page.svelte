<script lang="ts">
    import {page} from "$app/state";
    import {getFolderById} from "../../data/folders";
    import {writable, type Writable} from "svelte/store";

    let folder: Writable<Folder | null> = writable(null);
    let folderUnsubscriber: () => void;

    $effect(() => {
        if (page.params.folderId) {
            folderUnsubscriber?.();
            folderUnsubscriber = getFolderById(page.params.folderId, folder).unsubscriber
        }
    })
</script>

<div class="flex flex-col w-full h-full">
    <h1 class="text-3xl font-bold px-8 pt-8 pb-4">
        {$folder?.getDisplayName() ?? $folder?.name}
    </h1>

    <div class="flex flex-col lg:flex-row w-full h-full">
        <div class="flex-1">
            <div class="flex flex-col w-full h-full overflow-y-auto">
                <table class="w-full">
                    <thead>
                    <tr>
                        <td class="py-2 pl-8 w-1/2 text-sm font-semibold">Betreff</td>
                        <td class="p-2 w-1/4 text-sm font-semibold">Von</td>
                        <td class="p-2 w-1/4 text-sm font-semibold">Datum</td>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="flex-1 border-t border-t-gray-400 p-4">Box 2</div>
    </div>

</div>