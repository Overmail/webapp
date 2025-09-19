<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import {onMount} from "svelte";
    import check_auth from "$lib/auth/check_auth";
    import {page} from "$app/state";
    import {goto} from "$app/navigation";
	
	let { children } = $props();

    onMount(async () => {

        const pathsWithoutAuth = ["auth", "share"]
        const isInPathWithoutAuth = pathsWithoutAuth.some(path => page.url.pathname.startsWith(`/${path}`))

        if (!isInPathWithoutAuth) {
            const isAuthenticated = await check_auth()
            if (!isAuthenticated) await goto("/auth")
            else if (page.url.pathname === "/") await goto("/dashboard")
        }
    })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
    <title>Overmail</title>
</svelte:head>

<div class="w-full h-full">
    {@render children?.()}
</div>
