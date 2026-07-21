<script lang="ts">
    interface Props {
        title?: string;
        type?: string;
        small?: boolean;
        closeButton?: boolean;
        visible?: boolean;
        children?: import("svelte").Snippet;
    }

    let {
        title = "",
        type = "warning",
        small = false,
        closeButton = false,
        visible = $bindable(true),
        children,
    }: Props = $props();
</script>

{#if visible}
    <div role="alert" class="fr-alert fr-alert--{type} {small ? 'fr-alert--sm' : ''}">
        {#if !small}
            <p class="fr-alert__title">{title}</p>
        {/if}

        {@render children?.()}

        {#if closeButton}
            <button
                title="Masquer le message"
                onclick={() => (visible = false)}
                type="button"
                class="fr-btn--close fr-btn">
                Masquer le message
            </button>
        {/if}
    </div>
{/if}

<style>
    div {
        margin-bottom: 20px;
    }
</style>
