<script>
    import Spinner from "./Spinner.svelte";

    export let description;
</script>

<div class="fill-space">
    <Spinner {description} />
</div>

<style>
    /* used to avoid footer overlaspsing the blue banner */
    .fill-space {
        min-height: 30vh;
    }
</style>
