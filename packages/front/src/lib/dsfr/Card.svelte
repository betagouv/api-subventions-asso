<script>
    export let size = 4;
    export let title = "";
    // h1 to h6
    export let titleTag = "h3";
    export let titleStyle = titleTag ? titleTag : "h3";
    export let titleEllipsis = 3;
    export let keepSpaceForTitle = false;
    export let url = "";
    export let target = "";
    export let direction = undefined;
    export let download = false;
    export let noIcon = false;

    export let onClick = () => {};
</script>

<div class="fr-col-md-{size} fr-col-12">
    <div
        class="fr-card"
        class:fr-enlarge-link={!!url}
        class:fr-card--no-icon={noIcon}
        class:fr-card--horizontal={direction === "horizontal"}
        class:fr-card--download={download}>
        <div class="fr-card__body">
            <div class="fr-card__content">
                {#if $$slots["card-start"]}
                    <div class="fr-card__start">
                        <slot name="card-start" />
                    </div>
                {/if}
                <svelte:element
                    this={titleTag}
                    class="fr-card__title fr-{titleStyle}{keepSpaceForTitle ? ` min-height-${titleEllipsis}` : ''}">
                    <a
                        href={url}
                        on:click={onClick}
                        class="fr-card__link overflow-ellipsis-{titleEllipsis}"
                        {target}
                        title={target === "_blank" ? `${title} - nouvelle fenêtre` : undefined}
                        rel={target === "_blank" ? "noreferrer noopener" : undefined}>
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
        {#if $$slots["card-img"]}
            <div class="fr-card__header">
                <div class="fr-card__img">
                    <slot name="card-img" />
                </div>
            </div>
        {/if}
    </div>
</div>
