<script>
    export let title;
</script>

<div class="widget fr-p-4w">
    <h2 class="fr-h2">{title}</h2>
    <slot />
</div>

<style>
    .widget {
        border: 1px solid var(--border-disabled-grey);
    }
</style>
