<script>
    import DataNotFound from "../../components/DataNotFound.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "../../components/InfosLegales/InfosLegales.svelte";
    import associationService from "@resources/associations/association.service";
    import { siretToSiren } from "../../helpers/sirenHelper";
    import { activeBlueBanner } from "../../store/context.store";
    import FullPageSpinner from "../../components/FullPageSpinner.svelte";
    import StructureTitle from "../../components/StructureTitle/StructureTitle.svelte";
    import TabsEtab from "./components/TabsEtab.svelte";
    import establishmentService from "@resources/establishments/establishment.service";

    export let id;

    activeBlueBanner();

    const titles = ["Tableau de bord", "Contacts", "Pièces administratives", "Informations bancaires"];
    const associationPromise = associationService.getAssociation(siretToSiren(id));
    const etablissementPromise = establishmentService.getBySiret(id);
</script>

<div class="fr-container">
    {#await associationPromise}
        <FullPageSpinner description="Chargement de l'établissement {id} en cours ..." />
    {:then association}
        <div class="fr-mb-3w">
            <StructureTitle {association} siret={id} />
        </div>
        {#await etablissementPromise then etablissement}
            <div class="fr-mb-6w">
                <InfosLegales {association} {etablissement} />
            </div>
            <div class="fr-mb-6w">
                <TabsEtab {etablissement} {titles} identifier={id} />
            </div>
        {:catch error}
            {#if error.request && error.request.status === 404}
                <DataNotFound />
            {:else}
                <ErrorAlert message={error.message} />
            {/if}
        {/await}
    {/await}
</div>
