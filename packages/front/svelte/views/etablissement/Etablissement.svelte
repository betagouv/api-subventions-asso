<script>
    import Button from "../../dsfr/Button.svelte";
    import DataNotFound from "../../components/DataNotFound.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "../../components/InfosLegales/InfosLegales.svelte";
    import TabEtab from "./components/TabEtab.svelte";
    import etablissementService from "./etablissement.service";
    import associationService from "../association/association.service";
    import { siretToSiren } from "../../helpers/sirenHelper";
    import { getSiegeSiret } from "../association/association.helper";
    import { activeBlueBanner } from "../../store/context.store";
    import FullPageSpinner from "../../components/FullPageSpinner.svelte";

    export let id;

    activeBlueBanner();

    const titles = ["Tableau de bord", "Contacts", "Pièces administratives", "Informations bancaires"];
    const associationPromise = associationService.getAssociation(siretToSiren(id));
    const etablissementPromise = etablissementService.getById(id);
</script>

<div class="fr-container">
    {#await associationPromise}
        <FullPageSpinner description="Chargement de l'établissement {id} en cours ..." />
    {:then association}
        <InfosLegales {association}>
            <Button on:click={() => window.location.assign(`/association/${association.siren}`)} slot="action">
                Voir l'association
            </Button>
            <svelte:fragment slot="subtitle">
                {#if getSiegeSiret(association) === id}
                    <h2>Établissement siège de l'association</h2>
                {/if}
            </svelte:fragment>
        </InfosLegales>
        {#await etablissementPromise then etablissement}
            <TabEtab {etablissement} {titles} identifier={id} />
        {:catch error}
            {#if error.request && error.request.status === 404}
                <DataNotFound />
            {:else}
                <ErrorAlert message={error.message} />
            {/if}
        {/await}
    {/await}
</div>
