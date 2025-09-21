<script lang="ts">
    import type {Recipient, RecipientType} from "$lib/app/data/mails/mail";

    let {
        type,
        recipients
    }: {
        type: RecipientType,
        recipients: Recipient[]
    } = $props();

    let name = $derived.by(() => {
        switch (type) {
            case "to":
                return "An"
            case "cc":
                return "Cc"
            case "bcc":
                return "Bcc"
        }
    })
</script>

<tr>
    <td class="align-top pr-1">{name}:</td>
    <td>
        <ul>
            {#each recipients as item}
                <li class="flex flex-row flex-wrap">
                                            <span class="mr-1">{item.name}
                                                {#if item.is_me}
                                                    (dich)
                                                {/if}
                                            </span>
                    {#if item.email}
                        <span class="italic">({item.email})</span>
                    {/if}
                </li>
            {/each}
        </ul>
    </td>
</tr>