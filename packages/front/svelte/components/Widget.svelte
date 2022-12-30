<script>
    export let title = "";
</script>

<div class="widget fr-p-5v">
    <h2 class="fr-mb-3w">{title}</h2>
    <div>
        <slot />
    </div>
</div>

<style>
    .widget {
        border: 1px solid var(--border-default-grey);
    }
</style>
