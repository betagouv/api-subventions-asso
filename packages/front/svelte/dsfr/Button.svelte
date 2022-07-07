<script>
    import { createEventDispatcher } from "svelte";

    export let type = "primary";
    export let outline = true;
    export let size = "medium";
    export let disabled = false;
    export let icon = "";
    export let iconPosition = "";

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
</script>

<button
    on:click={() => dispatch("click")}
    class="fr-btn {getSpecificTypeClass()} {getSpecificSizeClass()} {iconClass} {getSpecificIconClass()}"
    {disabled}
    alt="test">
    <slot />
</button>
