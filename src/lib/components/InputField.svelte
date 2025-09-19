<script lang="ts">
    let {
        type,
        placeholder,
        class: className,
        value = $bindable(""),
        name,
        onkeydown
    } : {
        type: string
        placeholder?: string,
        class?: string,
        value?: string,
        name?: string,
        onkeydown?: (e: KeyboardEvent) => void,
    } = $props();
</script>

<input
        bind:value
        type={type}
        class={`${className ?? ""} border border-gray-300 rounded-lg text-sm p-2 w-full h-9 transition-all duration-200 focus:outline-none focus:ring-2 focus:accent-black`}
        placeholder={placeholder}
        name={name}
        onkeydown={onkeydown}
/>