<script>
    export let startTitle;
    export let closeBtn = false;
    export let endTitle = undefined;
    export let linkUrl = undefined;
    export let linkLabel = undefined;

    let title = startTitle;
    if (linkLabel && linkUrl) title += `<a href=${linkUrl}>${linkLabel}</a>`;
    if (endTitle) title += endTitle;
</script>

<div class="fr-notice fr-notice--info override">
    <div class="fr-container">
        <div class="fr-notice__body">
            <!-- eslint-disable-next-line svelte/no-at-html-tags ok because defined in component itself -->
            <p class="fr-notice__title">{@html title}</p>
            {#if closeBtn}
                <button on:click class="fr-btn--close fr-btn" title="Masquer le message">Masquer le message</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .override {
        color: var(--text-action-high-blue-france);
    }
</style>
