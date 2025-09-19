<script lang="ts">
    import loginBackground from "$lib/assets/login_background.jpg";

    let {
        children
    }: {
        children: any
    } = $props();

</script>

<div class="flex flex-row w-full h-full overflow-y-auto">
    <div class="flex flex-col h-full md:w-1/2 w-full">
        {@render children()}
    </div>

    <div class="md:flex flex-col h-full md:w-1/2 hidden p-8 top-0 absolute right-0">
        <!-- Decorative -->

        <img src={loginBackground} alt="Login Background" class="w-full h-full object-cover rounded-4xl" />
    </div>
</div>