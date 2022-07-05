<script>
    import { createEventDispatcher } from "svelte";

    export let type = "primary";
    export let outline = true;
    export let size = "medium";
    export let icon = "";

    const dispatch = createEventDispatcher();

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

    function getSpecificSizeClass() {
        return classBySize[size];
    }

    function getSpecificTypeClass() {
        if (type != "tertiary") return classByType[type];
        else if (outline) return classByType[type][0];
        else return classByType[type][1];
    }
</script>

<button on:click={() => dispatch("click")} class="fr-btn {getSpecificTypeClass()} {getSpecificSizeClass()} {icon}">
    <slot />
</button>
