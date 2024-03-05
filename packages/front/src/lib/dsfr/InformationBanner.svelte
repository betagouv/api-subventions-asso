<script>
    import { createEventDispatcher } from "svelte";

    export let closeBtn = false;

    const dispatch = createEventDispatcher();
</script>

<div class="fr-notice fr-notice--info">
    <div class="fr-container">
        <div class="fr-notice__body">
            <!-- eslint-disable-next-line svelte/no-at-html-tags ok because defined in component itself -->
            <p class="fr-notice__title">
                <slot />
            </p>
            {#if closeBtn}
                <button on:click={() => dispatch("close")} class="fr-btn--close fr-btn" title="Masquer le message">
                    Masquer le message
                </button>
            {/if}
        </div>
    </div>
</div>
