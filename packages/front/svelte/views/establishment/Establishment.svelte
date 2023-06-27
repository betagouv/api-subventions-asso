<script>
    import DataNotFound from "../../components/DataNotFound.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "../../components/InfosLegales/InfosLegales.svelte";
    import { activeBlueBanner } from "../../store/context.store";
    import FullPageSpinner from "../../components/FullPageSpinner.svelte";
    import StructureTitle from "../../components/StructureTitle/StructureTitle.svelte";
    import TabsEtab from "./components/TabsEtab.svelte";
    import { siretToSiren } from "@helpers/sirenHelper";
    import associationService from "@resources/associations/association.service";
    import establishmentService from "@resources/establishments/establishment.service";

    export let id;

    activeBlueBanner();

    const titles = ["Tableau de bord", "Contacts", "Pièces administratives", "Informations bancaires"];
    const associationPromise = associationService.getAssociation(siretToSiren(id));
    const establishmentPromise = establishmentService.getBySiret(id);
    const promises = Promise.all([associationPromise, establishmentPromise]);
</script>

<div class="fr-container">
    {#await promises}
        <FullPageSpinner description="Chargement de l'établissement {id} en cours ..." />
    {:then result}
        <div class="fr-mb-3w">
            <StructureTitle association={result[0]} siret={id} />
        </div>
        <div class="fr-mb-6w">
            <InfosLegales association={result[0]} establishment={result[1]} />
        </div>
        <div class="fr-mb-6w">
            <TabsEtab establishment={result[1]} {titles} identifier={id} />
        </div>
    {:catch error}
        {#if error.request && error.request.status === 404}
            <DataNotFound />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>
