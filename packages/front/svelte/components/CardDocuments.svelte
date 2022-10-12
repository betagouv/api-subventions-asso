<script>
    export let size = 4;
    export let title;
    export let url;
    export let footer = "";
</script>

<div class="fr-col-{size} fr-col-md-{size}">
    <div class="fr-card fr-card--no-arrow fr-enlarge-link">
        <div class="fr-card__body">
            <h2 class="fr-card__title"><a href={url} class="fr-card__link" download>{title}</a></h2>
            <p class="fr-card__desc">
                <slot />
            </p>
            <div class="fr-card__footer">
                <div class="fr-grid-row fr-grid-row--gutters">
                    <div class="fr-col-6 fr-col-md-6 card--document-column">
                        <p>{footer}</p>
                    </div>
                    <div class="fr-col-6 fr-col-md-6 card--document-column">
                        <span class="fr-fi-download-line" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .card--document-column {
        display: flex;
        align-items: center;
        --text-spacing: 0, 0, 0;
    }

    .card--document-column > p {
        font-size: 0.7em;
    }

    .card--document-column:last-child {
        display: flex;
        justify-content: end;
    }
</style>
