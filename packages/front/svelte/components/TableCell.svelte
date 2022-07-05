<script>
    export let primary = false;
</script>

<th class:primary>
    <slot />
</th>

<style>
    th.primary {
        background-color: "#f5f5fe";
    }
</style>
