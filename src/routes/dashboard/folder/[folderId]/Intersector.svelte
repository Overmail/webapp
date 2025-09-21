<script lang="ts">
    import {onMount} from "svelte";

    let {
        onIntersect
    }: {
        onIntersect: () => void
    } = $props();

    let element: HTMLElement | undefined = $state();


    onMount(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    onIntersect();
                }
            });
        });

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    })
</script>

<div bind:this={element}></div>