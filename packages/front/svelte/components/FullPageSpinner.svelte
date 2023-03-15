<script>
    import Spinner from "./Spinner.svelte";

    export let description;
</script>

<div class="fill-space">
    <Spinner {description} />
</div>

<style>
    /* used to avoid footer overlapping the blue banner */
    .fill-space {
        min-height: 30rem;
    }
</style>
