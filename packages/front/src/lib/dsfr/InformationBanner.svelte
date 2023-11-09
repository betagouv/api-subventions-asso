<script>
    export let title;
    export let closeBtn = false;
</script>

<div class="fr-notice fr-notice--info">
    <div class="fr-container">
        <div class="fr-notice__body">
            <p class="fr-notice__title">{title}</p>
            {#if closeBtn}
                <button
                    class="fr-btn--close fr-btn"
                    title="Masquer le message"
                    onclick="const notice = this.parentNode.parentNode.parentNode; notice.parentNode.removeChild(notice)">
                    Masquer le message
                </button>
            {/if}
        </div>
    </div>
</div>
