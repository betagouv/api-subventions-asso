<!-- TODO: créer des composants pour gérer l'affichage de modale au sein de l'application
    https://gouvfr.atlassian.net/wiki/spaces/DB/pages/476610770/Modale+-+Modal#Modale-simple
    Le DSFR demande à ce que la <dialog> soit positionné si possible comme enfant direct de <body>

    ici un exemple de Modal qui semble correctement implémenter l'accessiblité avec ARIA
    https://svelte.dev/repl/033e824fad0a4e34907666e7196caec4?version=3.20.1
-->
<script>
    import Button from "./Button.svelte";

    export let modalId;
    export let title;
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<dialog aria-labelledby="fr-modal-title-{modalId}" id="fr-modal-{modalId}" class="fr-modal">
    <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
                <div class="fr-modal__body">
                    <div class="fr-modal__header">
                        <Button
                            iconPosition="right"
                            icon="close-line"
                            ariaControls="fr-modal-{modalId}"
                            type="tertiary">
                            Fermer
                        </Button>
                    </div>
                    <div class="fr-modal__content">
                        <h1 id="fr-modal-title-{modalId}" class="fr-modal__title">
                            <span class="fr-fi-arrow-right-line fr-fi--lg" aria-hidden="true" />
                            {title}
                        </h1>
                        <div>
                            <slot name="content" />
                        </div>
                    </div>
                    {#if $$slots.footer}
                        <div class="fr-modal__footer">
                            <slot name="footer" />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</dialog>

<style>
    .fr-modal__header {
        display: flex;
        justify-content: flex-end;
    }

    .fr-modal__content > div {
        padding-top: 50px;
    }
</style>
