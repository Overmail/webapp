<script lang="ts">
    import {page} from "$app/state";
    import Mail from "./Mail.svelte";
    import Button from "$lib/components/Button.svelte";
    import {ArrowLeft} from "@lucide/svelte";

    let emailId = $derived(page.params.mailId)
</script>

<div class="flex flex-col h-full">
    <div class="flex-col px-4 pt-4">
        <Button
                icon={ArrowLeft}
                onclick={() => window.history.back()}
                label="Zurück"
                state="enabled"
                type="link"
        />
    </div>

    {#if emailId}
        <Mail mailId={emailId}/>
    {/if}
</div>
