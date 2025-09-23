<script lang="ts">
    import {Info, Lock, LogIn, ServerCrash, User} from "@lucide/svelte";
    import favicon from "$lib/assets/favicon_path.svg";
    import InputField from "$lib/components/InputField.svelte";
    import FormPart from "$lib/components/FormPart.svelte";
    import Button from "$lib/components/Button.svelte";
    import {page} from "$app/state";

    let form: HTMLFormElement;

    let showInvalidCredentials = page.url.searchParams.get("invalid") === "true";
    let serverError = page.url.searchParams.has("error") ? atob(page.url.searchParams.get("error")!) : null;

    let username = $state(page.url.searchParams.get("username") ?? "");

    function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            form.requestSubmit();
            event.preventDefault();
        }
    }
</script>

<svelte:head>
    <title>Anmelden - Overmail</title>
</svelte:head>

<div class="flex flex-col p-12">

    <img src={favicon} alt="Logo" class="w-12 h-12"/>

    <h1 class="text-3xl">
        Bei Overmail anmelden
    </h1>

    <div class="flex flex-col gap-2 mt-4">
        <form action="/api/auth/form" method="post" class="flex flex-col gap-2" bind:this={form}>
            <FormPart icon={User} title="Benutzername">
                {#snippet body()}
                    <InputField bind:value={username} type="text" onkeydown={onKeyDown} name="username"/>
                {/snippet}
            </FormPart>

            <FormPart icon={Lock} title="Passwort">
                {#snippet body()}
                    <InputField type="password" onkeydown={onKeyDown} name="password"/>
                {/snippet}
            </FormPart>
        </form>

        <div class="flex flex-row gap-2 mt-2 justify-end">
            <Button
                    class="w-fit"
                    variant="link"
                    label="Passwort vergessen"
            />
            <Button
                    class="w-fit"
                    icon={LogIn}
                    variant="primary"
                    label="Anmelden"
                    onclick={() => form.requestSubmit()}
            />
        </div>
    </div>

    {#if showInvalidCredentials}
        <div class="flex flex-row text-red-700 gap-2 bg-red-100 p-4 mt-4 rounded-md" role="alert" aria-live="assertive"
             aria-atomic="true">
            <Info class="w-6 h-6"/>
            <div class="flex flex-col">
                Ungültige Zugangsdaten.
            </div>
        </div>
    {/if}

    {#if serverError}
        <div class="flex flex-row text-red-700 gap-2 bg-red-100 p-4 mt-4 rounded-md overflow-x-scroll overflow-y-visible"
             role="alert" aria-live="assertive" aria-atomic="true">
            <ServerCrash class="w-6 h-6"/>
            <div class="flex flex-col">
                Serverfehler: {serverError}
            </div>
        </div>
    {/if}
</div>
