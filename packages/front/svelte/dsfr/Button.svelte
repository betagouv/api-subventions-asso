<script>
    import { createEventDispatcher } from "svelte";

    export let type = "primary";
    export let size = "medium";
    export let outline = true;
    export let disabled = false;
    export let title = "";
    export let icon = "";
    export let iconPosition = "";
    export let ariaControls = "";

    const dispatch = createEventDispatcher();

    const iconClass = !icon.length || icon.startsWith("fr-icon-") ? icon : `fr-icon-${icon}`;

    const classBySize = {
        small: "fr-btn--sm",
        medium: "fr-bn--md",
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

<button
    on:click={() => dispatch("click")}
    class={classes}
    {disabled}
    {title}
    aria-controls={ariaControls}
    data-fr-opened={ariaControls.length ? "false" : ""}>
    <slot />
</button>

<style>
    button {
        flex-shrink: 0;
    }
</style>
