<script>
    import TabsEtab from "./components/TabsEtab.svelte";
    import { EstablishmentController } from "./Establishment.controller";
    import DataNotFound from "$lib/components/DataNotFound.svelte";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import InfosLegales from "$lib/components/InfosLegales/InfosLegales.svelte";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import StructureTitle from "$lib/components/StructureTitle/StructureTitle.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    export let data;
    const { identifier: id } = data.params;

    const controller = new EstablishmentController(id);
    const { promises, titles } = controller;
</script>

<div class="fr-container">
    {#await promises}
        <FullPageSpinner description="Chargement de l'établissement {id} en cours ..." />
    {:then result}
        {#if controller.isAssociation}
            <div class="fr-mb-3w">
                <StructureTitle siret={id} />
            </div>
            <div class="fr-mb-6w">
                <InfosLegales association={result.association} establishment={result.establishment} />
            </div>
            <div class="fr-mb-6w">
                <TabsEtab establishment={result.establishment} {titles} identifier={id} />
            </div>
        {:else}
            <div class="fr-mb-3w">
                <Alert type="warning" title="Attention">
                    Il semblerait que vous cherchiez un établissement d'une entreprise et non d'une association
                </Alert>
            </div>
        {/if}
    {:catch error}
        {#if error.request && error.request.status === 404}
            <DataNotFound />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>
