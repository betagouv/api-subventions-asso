<script lang="ts">
    interface Props {
        type?: "success" | "error" | "info" | "warning" | "new";
        label?: string;
        color?: string;
        small?: boolean;
        noIcon?: boolean;
    }

    let { type = "success", label = "", color = undefined, small = false, noIcon = false }: Props = $props();

    let otherClasses = $state("fr-badge ");

    if (type) otherClasses += `fr-badge--${type} `;
    if (color) otherClasses += `fr-badge--${color} `;
</script>

<p class={otherClasses} class:fr-badge--sm={small} class:fr-badge--no-icon={noIcon}>
    <span class="fr-ellipsis">{label}</span>
</p>
