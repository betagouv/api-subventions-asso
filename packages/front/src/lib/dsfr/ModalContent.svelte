<script>
    export let title;
</script>

<div class="fr-modal__content">
    <h1 id="fr-modal-title" class="fr-modal__title">
        <span class="fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true" />
        {title}
    </h1>
    <slot />
</div>
