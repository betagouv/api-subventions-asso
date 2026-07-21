<script lang="ts">
    import { getIconClass } from "./helper";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    interface Props {
        title: string;
        // possible values for titleSize : [2, 3, 4, 5, 6, "p"]
        titleSize?: 2 | 3 | 4 | 5 | 6 | "p";
        href?: string | null;
        labelAction?: string | null;
        labelIcon?: string;
        icon?: string;
        children?: import("svelte").Snippet;
    }

    let {
        title,
        titleSize = 3,
        href = null,
        labelAction = null,
        labelIcon = undefined,
        icon = undefined,
        children,
    }: Props = $props();

    const titleTag = titleSize === "p" ? "p" : `h${titleSize}`;

    const actionClasses = `fr-btn${labelIcon ? " " + getIconClass(labelIcon) : ""}`;
    const calloutClasses = `fr-callout${icon ? " " + getIconClass(icon) : ""}`;
</script>

<div class={calloutClasses}>
    <svelte:element this={titleTag} class="fr-callout__title">{title}</svelte:element>
    <p class="fr-callout__text">
        {@render children?.()}
    </p>
    {#if href && labelAction}
        <TargetBlankLink linkClass={actionClasses} {href} title="{labelAction} - nouvelle fenêtre">
            {labelAction}
        </TargetBlankLink>
    {/if}
</div>
