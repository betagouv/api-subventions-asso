<script>
    import { createEventDispatcher } from "svelte";

    export let closeBtn = false;
    export let title = undefined;
    export let desc = undefined;
    // info | warning | alert |
    // weather-orange | weather-red | weather-purple |
    // attack | witness | cyberattack
    export let type = "info";

    const dispatch = createEventDispatcher();
</script>

<div class="fr-notice fr-notice--{type}">
    <div class="fr-container">
        <div class="fr-notice__body">
            {#if title}<span class="fr-notice__title">{title}</span>{/if}
            {#if desc} <span class="fr-notice__desc">{desc}</span>{/if}

            {#if closeBtn}
                <button on:click={() => dispatch("close")} class="fr-btn--close fr-btn" title="Masquer le message">
                    Masquer le message
                </button>
            {/if}
        </div>
    </div>
</div>
