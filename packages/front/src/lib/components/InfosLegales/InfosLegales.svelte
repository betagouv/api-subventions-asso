<script>
    import InfosLegalesController from "./InfosLegales.controller";
    import Button from "$lib/dsfr/Button.svelte";

    export let association;
    export let establishment = undefined;

    const controller = new InfosLegalesController(association, establishment);
</script>

<div class="fr-grid-row fr-p-4w background-default">
    <div class="fr-col fr-col-md-6 fr-pr-2w">
        <p class="fr-text--lg fr-text--bold">Objet social</p>
        <p>{controller.objetSocial}</p>
    </div>
    <div class="fr-col fr-col-md-6 fr-pl-2w">
        <table class="fr-mb-1v">
            <tr>
                <td class="fr-pb-2w fr-text--lg fr-text--bold fr-pr-2w">{controller.siret.title}</td>
                <td class="fr-pb-2w fr-text--sm">
                    {controller.siret.value}
                </td>
            </tr>
            <tr>
                <td class="fr-pb-2w fr-text--lg fr-text--bold fr-pr-2w">{controller.address.title}</td>
                <td class="fr-pb-2w fr-text--sm">
                    {controller.address.value}
                </td>
            </tr>
            <tr>
                <td class="fr-pb-2w fr-text--lg fr-text--bold fr-pr-2w">Date d'immatriculation</td>
                <td class="fr-pb-2w fr-text--sm">
                    {controller.immatriculation}
                </td>
            </tr>
            <tr>
                <td class="fr-pb-2w fr-text--lg fr-text--bold fr-pr-2w">Date de modification</td>
                <td class="fr-pb-2w fr-text--sm">
                    {controller.modification}
                </td>
            </tr>
        </table>
        {#if !establishment}
            <Button
                type="tertiary"
                size="small"
                icon="information-line"
                iconPosition="left"
                outline={false}
                ariaControls="fr-modal"
                on:click={() => controller.displayModal()}>
                Voir les informations du RNA / Siren
            </Button>
        {/if}
    </div>
</div>
