<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { getIconClass } from "./helper";
    import trackerService from "$lib/services/tracker.service";
    import { HTML_BUTTON_TYPES, isValidButtonType } from "$lib/helpers/htmlHelper";

    export let trackerName;
    export let trackingDisable = false;
    export let type = "primary";
    export let size = "medium";
    export let outline = true;
    export let disabled = false;
    export let styleClass = "";
    export let title = "";
    export let icon = "";
    export let iconPosition = "";
    export let ariaControls = "";
    export let htmlType: (typeof HTML_BUTTON_TYPES)[number] = "button";

    if (!isValidButtonType(htmlType)) {
        console.warn(`${htmlType} is not a valid button type. Use default button type instead`);
        htmlType = "button";
    }

    if (!trackerName && !trackingDisable) console.error("Please add tracker name on button");

    const dispatch = createEventDispatcher();

    const classBySize = {
        small: "fr-btn--sm",
        medium: "fr-bn--md",
        large: "fr-bn--lg",
    };

    const classByType = {
        primary: "",
        secondary: "fr-btn--secondary",
        tertiary: ["fr-btn--tertiary", "fr-btn--tertiary-no-outline"],
    };

    const classByIcon = {
        right: "fr-btn--icon-right",
        left: "fr-btn--icon-left",
        default: "",
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

    const classes = `fr-btn ${getSpecificTypeClass()} ${getSpecificSizeClass()} ${getIconClass(icon)}
     ${getSpecificIconClass()} ${styleClass}`;

    function track() {
        if (!trackingDisable) trackerService.buttonClickEvent(trackerName, title);
    }

    function onClick() {
        dispatch("click");
        track();
    }

    function onSubmit() {
        dispatch("submit");
        track();
    }
</script>

<button
    on:click={() => onClick()}
    on:submit={() => onSubmit()}
    class={classes}
    {disabled}
    {title}
    aria-controls={ariaControls}
    data-fr-opened={ariaControls.length ? "false" : ""}
    type={htmlType}>
    <slot />
</button>

<style>
    button {
        flex-shrink: 0;
    }
</style>
