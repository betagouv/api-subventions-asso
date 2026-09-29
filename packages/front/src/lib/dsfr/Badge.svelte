<script lang="ts">
    interface Props {
        type?: "success" | "error" | "info" | "warning" | "new";
        label?: string;
        color?: string;
        small?: boolean;
        noIcon?: boolean;
    }

    let { type = "success", label = "", color = undefined, small = false, noIcon = false }: Props = $props();

    const otherClasses = $derived(`fr-badge ${type ? `fr-badge--${type} ` : ""}${color ? `fr-badge--${color} ` : ""}`);
</script>

<p class={otherClasses} class:fr-badge--sm={small} class:fr-badge--no-icon={noIcon}>
    <span class="fr-ellipsis">{label}</span>
</p>
