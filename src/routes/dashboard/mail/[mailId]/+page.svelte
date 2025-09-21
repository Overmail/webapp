<script lang="ts">
    import {page} from "$app/state";
    import Mail from "./Mail.svelte";

    let emailId = $derived(page.params.mailId)
</script>

<div class="flex flex-col h-full">
    {#if emailId}
        <Mail mailId={emailId} onBack={() => window.history.back()} />
    {/if}
</div>
