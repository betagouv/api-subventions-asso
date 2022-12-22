<script>
    import { isHyphen } from "../../helpers/stringHelper";
    import TableCell from "./TableCell.svelte";

    export let value;
    export let primary = false;

    let position = "end";

    if (isHyphen(value)) position = "center";
</script>

<TableCell {primary} {position}>{value}</TableCell>
