<script>
    import TabsAsso from "./components/TabsAsso.svelte";
    import { AssociationController } from "./Association.controller";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import InfosLegales from "$lib/components/InfosLegales/InfosLegales.svelte";
    import DataNotFound from "$lib/components/DataNotFound.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import StructureTitle from "$lib/components/StructureTitle/StructureTitle.svelte";

    export let data;
    const { identifier } = data.params;

    const controller = new AssociationController(identifier);
    const { promise, titles } = controller;
</script>

{#await promise}
    <FullPageSpinner description="Chargement de l'association {identifier} en cours ..." />
{:then association}
    {#if controller.isAssociation(association)}
        <div class="fr-mb-3w">
            <StructureTitle {association} />
        </div>
        <div class="fr-mb-6w">
            <InfosLegales {association} />
        </div>
        <div class="fr-mb-6w">
            <TabsAsso {titles} associationIdentifier={identifier} {association} />
        </div>
    {:else}
        <div class="fr-mb-3w">
            <Alert type="warning" title="Attention">
                Il semblerait que vous cherchiez une entreprise et non une association
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
