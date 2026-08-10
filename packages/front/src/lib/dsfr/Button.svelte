<script lang="ts">
    import { getIconClass } from "./helper";
    import trackerService from "$lib/services/tracker.service";
    import { HTML_BUTTON_TYPES, isValidButtonType } from "$lib/helpers/htmlHelper";
    import { uuid } from "$lib/helpers/stringHelper";

    type ButtonStyle = "primary" | "secondary" | "tertiary";
    type ButtonSize = "small" | "medium" | "large";
    type IconPosition = "right" | "left" | "";

    interface Props {
        id?: string;
        trackerName?: string;
        trackingDisable?: boolean;
        type?: ButtonStyle;
        size?: ButtonSize;
        outline?: boolean;
        disabled?: boolean;
        styleClass?: string;
        title?: string;
        icon?: string;
        iconPosition?: IconPosition;
        ariaControls?: string;
        htmlType?: (typeof HTML_BUTTON_TYPES)[number];
        onclick?: () => void;
        onsubmit?: () => void;
        children?: import("svelte").Snippet;
    }

    let {
        id = "btn-" + uuid(),
        trackerName = "",
        trackingDisable = false,
        type = "primary",
        size = "medium",
        outline = true,
        disabled = false,
        styleClass = "",
        title = "",
        icon = "",
        iconPosition = "",
        ariaControls = "",
        htmlType = $bindable("button"),
        onclick = () => {},
        onsubmit = () => {},
        children,
    }: Props = $props();

    if (!isValidButtonType(htmlType)) {
        console.warn(`${htmlType} is not a valid button type. Use default button type instead`);
        htmlType = "button";
    }

    if (!trackerName && !trackingDisable) console.error("Please add tracker name on button");

    const classBySize = {
        small: "fr-btn--sm",
        medium: "fr-btn--md",
        large: "fr-btn--lg",
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
        onclick();
        track();
    }

    function onSubmit() {
        onsubmit();
        track();
    }
</script>

<button
    {id}
    onclick={() => onClick()}
    onsubmit={() => onSubmit()}
    class={classes}
    {disabled}
    {title}
    aria-controls={ariaControls}
    data-fr-opened={ariaControls.length ? "false" : ""}
    type={htmlType}>
    {@render children?.()}
</button>

<style>
    button {
        flex-shrink: 0;
    }
</style>
