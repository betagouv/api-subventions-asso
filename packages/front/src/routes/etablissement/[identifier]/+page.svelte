<script>
    import TabsEtab from "./components/TabsEtab.svelte";
    import DataNotFound from "$lib/components/DataNotFound.svelte";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import InfosLegales from "$lib/components/InfosLegales/InfosLegales.svelte";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import StructureTitle from "$lib/components/StructureTitle/StructureTitle.svelte";
    import { siretToSiren } from "$lib/helpers/sirenHelper";
    import associationService from "$lib/resources/associations/association.service";
    import establishmentService from "$lib/resources/establishments/establishment.service";
    import { currentAssociation } from "$lib/store/association.store";

    export let data;
    const { identifier: id } = data.params;

    const titles = ["Tableau de bord", "Contacts", "Pièces administratives", "Informations bancaires"];
    const associationPromise = associationService.getAssociation(siretToSiren(id)).then(asso => {
        currentAssociation.set(asso);
        return asso;
    });
    const establishmentPromise = establishmentService.getBySiret(id);
    const promises = Promise.all([associationPromise, establishmentPromise]).then(result => ({
        association: result[0],
        establishment: result[1],
    }));
</script>

<div class="fr-container">
    {#await promises}
        <FullPageSpinner description="Chargement de l'établissement {id} en cours ..." />
    {:then result}
        <div class="fr-mb-3w">
            <StructureTitle siret={id} />
        </div>
        <div class="fr-mb-6w">
            <InfosLegales association={result.association} establishment={result.establishment} />
        </div>
        <div class="fr-mb-6w">
            <TabsEtab establishment={result.establishment} {titles} identifier={id} />
        </div>
    {:catch error}
        {#if error.request && error.request.status === 404}
            <DataNotFound />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>
