<script>
    export let size = 4;
    export let title = "";
    // h1 to h6
    export let titleLevel = 3;
    export let url = "";
    export let img = false;
    export let target = "";
    export let direction = undefined;
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- default value
    export let onClick = () => {};
</script>

<div class="fr-col-{size} fr-col-md-{size}">
    <div class={`fr-card fr-enlarge-link ${direction === "horizontal" ? " fr-card--horizontal" : ""}`}>
        <div class="fr-card__body">
            <div class="fr-card__content">
                <div class="fr-card__start">
                    <slot name="card-start" />
                </div>
                <slot name="card-title">
                    <h3 class={`fr-card__title fr-h${titleLevel}`}>
                        <a href={url} on:click={onClick} class="fr-card__link" {target}>{title}</a>
                    </h3>
                </slot>
                <p class="fr-card__desc">
                    <slot />
                </p>
                {#if $$slots["card-end"]}
                    <div class="fr-card__end">
                        <slot name="card-end" />
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
