<script>
    export let id;
    export let index;
</script>

<tr id="table-${id}-row-key-${index}" data-row-key={index}>
    <slot />
</tr>
