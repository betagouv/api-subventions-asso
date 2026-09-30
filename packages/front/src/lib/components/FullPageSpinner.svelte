<script lang="ts">
    import Spinner from "./Spinner.svelte";

    let { description } = $props();
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
