<script>
    import { getIconClass } from "./helper";

    export let title;
    // possible values for titleSize : [2, 3, 4, 5, 6, "p"]
    export let titleSize = 3;
    export let href = null;
    export let labelAction = null;
    export let labelIcon = undefined;
    export let icon = undefined;

    const titleTag = titleSize === "p" ? "p" : `h${titleSize}`;

    const actionClasses = `fr-btn${labelIcon ? " " + getIconClass(labelIcon) : ""}`;
    const calloutClasses = `fr-callout${icon ? " " + getIconClass(icon) : ""}`;
</script>

<div class={calloutClasses}>
    <svelte:element this={titleTag} class="fr-callout__title">{title}</svelte:element>
    <p class="fr-callout__text">
        <slot />
    </p>
    {#if href && labelAction}
        <a
            class={actionClasses}
            {href}
            target="_blank"
            rel="noopener external"
            title="{labelAction} - nouvelle fenêtre">
            {labelAction}
        </a>
    {/if}
</div>
