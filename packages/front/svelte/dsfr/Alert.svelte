<script>
    export let title;
    export let type = "warning";
    export let small = false;
</script>

<div role="alert" class="fr-alert fr-alert--{type} {small ? 'fr-alert--sm' : ''}">
    {#if !small}
        <p class="fr-alert__title">{title}</p>
    {/if}
    <slot />
</div>

<style>
    div {
        margin-bottom: 20px;
    }
</style>
