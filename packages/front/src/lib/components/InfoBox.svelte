<script>
    export let title;
</script>

<div class="background-custom-alt-blue-france fr-p-8v">
    {#if title}
        <p class="fr-text--lg fr-text--bold">{title}</p>
    {/if}

    <slot></slot>
</div>

<style>
    .background-custom-alt-blue-france {
        background-color: var(--background-alt-blue-france);
    }
</style>
