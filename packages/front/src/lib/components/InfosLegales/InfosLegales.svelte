<script>
    import InfosLegalesController from "./InfosLegales.controller";
    import Button from "$lib/dsfr/Button.svelte";
    import Badge from "$lib/dsfr/Badge.svelte";

    export let association;
    export let establishment = undefined;

    const controller = new InfosLegalesController(association, establishment);
</script>

<div class="fr-grid-row fr-p-4w background-default">
    <div class="fr-col-md-6 fr-pr-2w">
        <p class="fr-text--lg fr-text--bold">Objet social</p>
        <p>{controller.objetSocial}</p>
    </div>
    <div class="fr-col-md-6 fr-pl-2w">
        <div class="fr-grid-row">
            <div class="fr-col-6 fr-text--lg fr-text--bold">
                {controller.siret.title} :
            </div>
            <div class="fr-col-6 fr-text--md">
                {controller.siret.value}
            </div>
        </div>
        <div class="fr-grid-row">
            <div class="fr-col-6 fr-text--lg fr-text--bold">
                {controller.address.title} :
            </div>
            <div class="fr-col-6 fr-text--md">
                {controller.address.value}
            </div>
        </div>
        {#if !establishment}
            <div class="fr-grid-row">
                <div class="fr-col-6 fr-text--lg fr-text--bold">Date d'immatriculation :</div>
                <div class="fr-col-6 fr-text--md">
                    {controller.immatriculation}
                </div>
            </div>
            <div class="fr-grid-row">
                <div class="fr-col-6 fr-text--lg fr-text--bold">Date de modification :</div>
                <div class="fr-col-6 fr-text--md">
                    {controller.modification}
                </div>
            </div>
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
        {:else}
            <div class="fr-grid-row">
                <div class="fr-col-6 fr-text--lg fr-text--bold">NIC :</div>
                <div class="fr-col-6 fr-text--md">
                    {controller.nic}
                </div>
            </div>
            <div class="fr-grid-row">
                <div class="fr-col-6 fr-text--lg fr-text--bold">État administratif :</div>
                <div class="fr-col-6 fr-text--md">
                    <Badge {...controller.estabStatusBadgeOptions} />
                </div>
            </div>
        {/if}
    </div>
</div>
