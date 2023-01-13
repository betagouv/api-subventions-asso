<script>
    import InfosLegalesController from "./InfosLegales.controller";
    import Button from "../../dsfr/Button.svelte";

    export let association;
    export let etablissement = undefined;

    const controller = new InfosLegalesController(association, etablissement);
</script>

<div class="fr-grid-row fr-p-4w background-default">
    <div class="fr-col fr-col-md-6 fr-pr-2w">
        <p class="fr-text--lg fr-text--bold">Objet social</p>
        <p>{association.objet_social}</p>
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
        {#if !etablissement}
            <Button
                type="tertiary"
                size="small"
                icon="information-line"
                iconPosition="left"
                outline={false}
                ariaControls="fr-modal"
                on:click={() => controller.displayModal()}>
                Plus de détails
            </Button>
        {/if}
    </div>
</div>
