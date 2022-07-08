<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let type = "primary";
    export let outline = true;
    export let size = "medium";
    export let disabled = false;
    export let icon = "";
    export let iconPosition = "";
    export let tooltip = "";

    let element;
    let tooltipElement;

    onMount(() => {
        if (tooltipElement && element) {
            element.addEventListener("mouseover", () => {
                const boxElement = element.getBoundingClientRect();
                const boxTooltipElement = tooltipElement.getBoundingClientRect();

                const computedRigthPosition = (boxElement.width - boxTooltipElement.width) / 2;
                tooltipElement.style.right = `${computedRigthPosition}px`;
            });
        }
    });

    const dispatch = createEventDispatcher();

    const iconClass = !icon.length || icon.startsWith("fr-fi-") ? icon : `fr-fi-${icon}`;

    const classBySize = {
        small: "fr-btn--sm",
        medium: "",
        large: "fr-bn--lg"
    };

    const classByType = {
        primary: "",
        secondary: "fr-btn--secondary",
        tertiary: ["fr-btn--tertiary", "fr-btn--tertiary-no-outline"]
    };

    const classByIcon = {
        right: "fr-btn--icon-right",
        left: "fr-btn--icon-left",
        default: ""
    };

    function getSpecificSizeClass() {
        return classBySize[size];
    }

    function getSpecificIconClass() {
        return classByIcon[iconPosition] || classByIcon.default;
    }

    function getSpecificTypeClass() {
        if (type != "tertiary") return classByType[type];
        else if (outline) return classByType[type][0];
        else return classByType[type][1];
    }

    const classes = `fr-btn ${getSpecificTypeClass()} ${getSpecificSizeClass()} ${iconClass} 
     ${getSpecificIconClass()}`;
</script>

<button bind:this={element} on:click={() => dispatch("click")} class={classes} {disabled} alt="test">
    <slot />
    {#if tooltip.length}
        <span class="tooltiptext" bind:this={tooltipElement}>{tooltip}</span>
    {/if}
</button>

<style>
    button {
        position: relative;
    }

    button .tooltiptext {
        visibility: hidden;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        opacity: 0;
        transition: opacity 0.3s;
    }

    button .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    button:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }

    button:hover {
        overflow: initial;
    }
</style>
