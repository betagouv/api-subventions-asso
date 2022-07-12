<script>
    export let title;
    export let type = "warning";
</script>

<div role="alert" class="fr-alert fr-alert--{type}">
    <p class="fr-alert__title">{title}</p>
    <slot />
</div>

<style>
    div {
        margin-bottom: 20px;
    }
</style>
