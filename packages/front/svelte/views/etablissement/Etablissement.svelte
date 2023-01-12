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
    import AssoEtabTitle from "../../components/StructureTitle/StructureTitle.svelte";

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
        <AssoEtabTitle {association} etablissementId="id" />
        <InfosLegales {association} />
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
