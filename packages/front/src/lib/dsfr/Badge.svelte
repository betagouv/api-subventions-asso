<script lang="ts">
    export let type: "success" | "error" | "info" | "warning" | "new" = "success"; //
    export let label = "";
    export let color = undefined;
    export let small = false;
    export let noIcon = false;

    let otherClasses = "fr-badge ";

    if (type) otherClasses += `fr-badge--${type} `;
    if (color) otherClasses += `fr-badge--${color} `;
</script>

<p class={otherClasses} class:fr-badge--sm={small} class:fr-badge--no-icon={noIcon}>{label}</p>
