<script>
    export let title = "";
    export let type = "warning";
    export let small = false;
    export let closeButton = false;
    export let visible = true;

    function closeAlert() {
        visible = false;
    }
</script>

{#if visible}
    <div role="alert" class="fr-alert fr-alert--{type} {small ? 'fr-alert--sm' : ''}">
        {#if !small}
            <p class="fr-alert__title">{title}</p>
        {/if}

        <slot />

        {#if closeButton}
            <button title="Masquer le message" on:click={closeAlert} type="button" class="fr-btn--close fr-btn">
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
