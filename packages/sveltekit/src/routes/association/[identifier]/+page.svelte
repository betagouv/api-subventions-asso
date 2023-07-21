<script>
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import InfosLegales from "$lib/components/InfosLegales/InfosLegales.svelte";
    import DataNotFound from "$lib/components/DataNotFound.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import FullPageSpinner from "$lib/components/FullPageSpinner.svelte";
    import StructureTitle from "$lib/components/StructureTitle/StructureTitle.svelte";
    import TabsAsso from "./components/TabsAsso.svelte";
    import { AssociationController } from "./Association.controller";

    export let data
    const { identifier } = data.params;

    const controller = new AssociationController(identifier);
    const { association: associationPromise, titles } = controller;
</script>

{#await associationPromise}
    <FullPageSpinner description="Chargement de l'association {identifier} en cours ..." />
{:then association}
    {#if !association}
        <div class="fr-mb-3w">
            <Alert type="warning" title="Attention">Nous n'avons pas connaissance de cette association</Alert>
        </div>
    {/if}
    {#if !controller.isAssociation()}
        <div class="fr-mb-3w">
            <Alert type="warning" title="Attention">
                Il semblerait que vous cherchiez une entreprise et non une association
            </Alert>
        </div>
    {/if}
    <div class="fr-mb-3w">
        <StructureTitle {association} />
    </div>
    <div class="fr-mb-6w">
        <InfosLegales {association} />
    </div>
    <div class="fr-mb-6w">
        <TabsAsso {titles} associationIdentifier={identifier} {association} />
    </div>
{:catch error}
    {#if error.request && error.request.status == 404}
        <DataNotFound />
    {:else}
        <ErrorAlert message={error.message} />
    {/if}
{/await}
