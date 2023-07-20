<script>
    import { getIconClass } from "./helper";

    export let size = 4;
    export let title = "";
    export let url;
    export let img = false;
    export let target = "";
    export let direction = undefined;
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- default value
    export let onClick = () => {};

    // second detail zone
    export let endIcon = undefined;
    export let endDetail = undefined;
    const endClasses = ["fr-card__detail", endIcon ? getIconClass(endIcon) : ""].join(" ");
</script>

<div class="fr-col-{size} fr-col-md-{size}">
    <div class={`fr-card fr-enlarge-link${direction === "horizontal" ? " fr-card--horizontal" : ""}`}>
        <div class="fr-card__body">
            <div class="fr-card__content">
                <div class="fr-card__start">
                    <slot name="card-start" />
                </div>
                <h2 class="fr-card__title">
                    <a href={url} on:click={onClick} class="fr-card__link" {target}>{title}</a>
                </h2>
                <p class="fr-card__desc">
                    <slot />
                </p>
                {#if endDetail}
                    <div class="fr-card__end">
                        <p class={endClasses}>{endDetail}</p>
                    </div>
                {/if}
            </div>
        </div>
        {#if img}
            <div class="fr-card__header">
                <div class="fr-card__img">
                    <img src={img} alt="Image de {title}" />
                </div>
            </div>
        {/if}
    </div>
</div>
