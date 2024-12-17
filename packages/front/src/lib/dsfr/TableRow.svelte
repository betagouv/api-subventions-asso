<script>
    export let id;
    export let index;
    export let openModal = false;
</script>

<tr
    aria-controls={openModal ? "fr-modal" : ""}
    data-fr-opened={openModal ? "true" : "false"}
    id="table-${id}-row-key-${index}"
    data-row-key={index}>
    <slot />
</tr>
