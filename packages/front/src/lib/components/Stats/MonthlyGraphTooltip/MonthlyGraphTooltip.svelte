<script>
    import { tick } from "svelte";
    import { MonthlyGraphTooltipController } from "./MonthlyGraphTooltip.controller";

    export let resource = "";
    export let context = {};
    export let withPreviousValue = false;
    export let year;

    const ctrl = new MonthlyGraphTooltipController(withPreviousValue, year);
    const { style, date, number } = ctrl;

    $: (async () => {
        await tick(); // without tick, tooltipContext is not up-to-date
        ctrl.update(context);
    })();
</script>

<div class="tooltip-container" style={$style} role="tooltip">
    <div class="tooltip-content fr-p-2w fr-text--xs fr-m-0">
        <div class="date">{$date}</div>
        <div class="fr-h4 fr-mb-0">{$number}</div>
        <div class="resource">{resource}</div>
    </div>
</div>

<style>
    /* thanks https://www.adfreak.de/en/blog/create-tooltips-with-css-and-html-box-shadow-css3-border-text-shadow/ */

    .tooltip-container {
        position: absolute;
        opacity: 0;
        transform: translateX(-50%) translateY(-100%);
        width: fit-content;
        --shadow-color-one: rgba(58, 58, 58, 0.08);
        --shadow-colo-two: rgba(58, 58, 58, 0.06);
        pointer-events: none;
        transition: opacity 0.1s ease;
        --target-size: 1rem;
        --size: calc(var(--target-size) / 1.41);
        margin-top: calc(-1 * var(--size));
        white-space: nowrap;
    }

    :global(:root:where([data-fr-theme="dark"])) .tooltip-container {
        /* --grey-200-850 with different opacities */
        --shadow-color-one: rgba(206, 206, 206, 0.08);
        --shadow-colo-two: rgba(206, 206, 206, 0.06);
    }

    .tooltip-container::before {
        content: "";
        width: var(--size);
        height: var(--size);
        position: absolute;
        bottom: calc(-1 * calc(var(--size) / 2));
        left: 50%;
        margin-left: calc(-1 * calc(var(--size) / 2));
        box-shadow:
            0 0.5rem 0.5rem var(--shadow-color-one),
            0 0.5rem 1rem var(--shadow-colo-two);
        background: var(--background-default-grey);
        rotate: 45deg;
    }

    .tooltip-content {
        box-shadow:
            0 0.5rem 0.5rem var(--shadow-color-one),
            0 0.5rem 1rem var(--shadow-colo-two);
        background: var(--background-default-grey);
        border-radius: 10% / 20%;
        text-align: end;
    }

    .tooltip-container .date,
    .tooltip-container .resource {
        color: var(--text-mention-grey);
    }

    .tooltip-container .date {
        font-size: 0.625rem;
    }
</style>
