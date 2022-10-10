<script>
    export let size = 4;
    export let title = "";
    export let url;
    export let img = false;
    export let target = "";
</script>

<div class="fr-col-{size} fr-col-md-{size}">
    <div class="fr-card fr-enlarge-link">
        <div class="fr-card__body">
            <h2 class="fr-card__title"><a href={url} class="fr-card__link" {target}>{title}</a></h2>
            <p class="fr-card__desc">
                <slot />
            </p>
        </div>
        {#if img}
            <div class="fr-card__img">
                <img src={img} alt="Image de {title}" />
            </div>
        {/if}
    </div>
</div>
