<script>
    import { getIconClass } from "./helper";

    export let title;
    // [2, 3, 4, 5, 6, "p"]
    export let titleSize = 3;
    export let href = null;
    export let labelAction = null;
    export let labelIcon = undefined;
    export let icon = undefined;

    console.log(`titleSize = ${titleSize}`);

    const actionClasses = `fr-btn${labelIcon ? " " + getIconClass(labelIcon) : ""}`;
    const calloutClasses = `fr-callout${icon ? " " + getIconClass(icon) : ""}`;
</script>

<div class={calloutClasses}>
    {#if titleSize == 2}
        <h2 class="fr-callout__title">{title}</h2>
    {:else if titleSize == 4}
        <h4 class="fr-callout__title">{title}</h4>
    {:else if titleSize == 5}
        <h5 class="fr-callout__title">{title}</h5>
    {:else if titleSize == 6}
        <h6 class="fr-callout__title">{title}</h6>
    {:else if titleSize == "p"}
        <p class="fr-callout__title">{title}</p>
    {:else}
        <h3 class="fr-callout__title">{title}</h3>
    {/if}
    <p class="fr-callout__text">
        <slot />
    </p>
    {#if href && labelAction}
        <a class={actionClasses} {href} target="_blank" rel="noreferrer">
            {labelAction}
        </a>
    {/if}
</div>
