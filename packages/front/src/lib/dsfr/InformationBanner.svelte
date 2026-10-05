<script lang="ts">
    // info | warning | alert |
    // weather-orange | weather-red | weather-purple |

    interface Props {
        closeBtn?: boolean;
        title?: string;
        desc?: string;
        // attack | witness | cyberattack
        type?: string;
        onclose?: () => void;
    }

    let { closeBtn = false, title = undefined, desc = undefined, type = "info", onclose = () => {} }: Props = $props();
</script>

<div class="fr-notice fr-notice--{type}">
    <div class="fr-container">
        <div class="fr-notice__body">
            {#if title}<span class="fr-notice__title">{title}</span>{/if}
            {#if desc}
                <!-- svelte/no-at-html-tags -->
                <span class="fr-notice__desc">{@html desc}</span>{/if}

            {#if closeBtn}
                <button onclick={onclose} class="fr-btn--close fr-btn" title="Masquer le message">
                    Masquer le message
                </button>
            {/if}
        </div>
    </div>
</div>
