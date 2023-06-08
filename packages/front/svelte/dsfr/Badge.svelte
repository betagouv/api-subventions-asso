<script>
    export let type = false; // "success" | "error" | "info" | "warning" | "new"
    export let noIcon = false;
    export let small = false;
    export let color = false;
    export let label = "";

    let otherClasses = "fr-badge ";

    if (type) otherClasses += `fr-badge--${type} `;
    if (color) otherClasses += `fr-badge--${color} `;
</script>

<p class={otherClasses} class:fr-badge--sm={small} class:fr-badge--no-icon={noIcon}>{label}</p>
