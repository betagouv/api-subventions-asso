<script>
    export let size = 4;
    export let title = "";
    // h1 to h6
    export let titleTag = "h3";
    export let titleStyle = titleTag ? titleTag : "h3";
    export let titleEllipsis = 2;
    export let url = "";
    export let img = false;
    export let target = "";
    export let direction = undefined;
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- default value
    export let onClick = () => {};
</script>

<div class="fr-col-md-{size} fr-col-12">
    <div class={`fr-card fr-enlarge-link`} class:fr-card--horizontal={direction === "horizontal"}>
        <div class="fr-card__body">
            <div class="fr-card__content">
                {#if $$slots["card-start"]}
                    <div class="fr-card__start">
                        <slot name="card-start" />
                    </div>
                {/if}
                <svelte:element this={titleTag} class="fr-card__title fr-{titleStyle}">
                    <a href={url} on:click={onClick} class="fr-card__link overflow-ellipsis-{titleEllipsis}" {target}>
                        {title}
                    </a>
                </svelte:element>
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
