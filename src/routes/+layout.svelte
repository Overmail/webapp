<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import {onMount} from "svelte";
    import check_auth from "$lib/auth/check_auth";
    import {page} from "$app/state";
    import {goto} from "$app/navigation";
	
	let { children } = $props();

    onMount(async () => {
        if (!page.url.pathname.startsWith("/auth")) {
            const isAuthenticated = await check_auth()
            if (!isAuthenticated) {
                await goto("/auth")
            }
        }
    })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="w-full h-full">
    {@render children?.()}
</div>
