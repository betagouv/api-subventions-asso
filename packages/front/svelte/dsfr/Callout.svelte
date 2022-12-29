<script>
    export let title;
    export let href = null;
    export let labelAction = null;
</script>

<div class="fr-callout fr-fi-information-line">
    <h3 class="fr-callout__title">{title}</h3>
    <p class="fr-callout__text">
        <slot />
    </p>
    {#if href && labelAction}
        <a class="fr-btn" {href} target="_blank" rel="noreferrer">
            {labelAction}
        </a>
    {/if}
</div>
