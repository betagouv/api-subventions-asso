<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        size?: number;
        title?: string;
        titleTag?: string;
        titleStyle?: string;
        titleEllipsis?: number;
        keepSpaceForTitle?: boolean;
        url?: string;
        target?: string;
        direction?: string | undefined;
        download?: boolean;
        noIcon?: boolean;
        onclick?: () => void;
        children?: Snippet;
        cardStart?: Snippet;
        cardEnd?: Snippet;
        cardImg?: Snippet;
    }

    let {
        size = 4,
        title = "",
        titleTag = "h3",
        titleStyle = titleTag ? titleTag : "h3",
        titleEllipsis = 3,
        keepSpaceForTitle = false,
        url = "",
        target = "",
        direction = undefined,
        download = false,
        noIcon = false,
        onclick = () => {},
        children,
        cardStart,
        cardEnd,
        cardImg,
    }: Props = $props();
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
                {#if cardStart}
                    <div class="fr-card__start">
                        {@render cardStart()}
                    </div>
                {/if}
                <svelte:element
                    this={titleTag}
                    class="fr-card__title fr-{titleStyle}{keepSpaceForTitle ? ` min-height-${titleEllipsis}` : ''}">
                    <a
                        href={url}
                        {onclick}
                        class="fr-card__link overflow-ellipsis-{titleEllipsis}"
                        {target}
                        title={target === "_blank" ? `${title} - nouvelle fenêtre` : undefined}
                        rel={target === "_blank" ? "noreferrer noopener" : undefined}>
                        {title}
                    </a>
                </svelte:element>
                <p class="fr-card__desc">
                    {@render children?.()}
                </p>
                {#if cardEnd}
                    <div class="fr-card__end">
                        {@render cardEnd()}
                    </div>
                {/if}
            </div>
        </div>
        {#if cardImg}
            <div class="fr-card__header">
                <div class="fr-card__img">
                    {@render cardImg()}
                </div>
            </div>
        {/if}
    </div>
</div>
