<script>
    import TableCell from "./TableCell.svelte";
    import { isHyphen } from "$lib/helpers/stringHelper";

    export let value;
    export let primary = false;

    export let position = "end";

    if (isHyphen(value)) position = "center";
</script>

<TableCell {primary} {position}>{value}</TableCell>
