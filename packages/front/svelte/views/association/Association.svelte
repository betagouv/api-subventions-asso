<script>
    import Alert from "../../dsfr/Alert.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "../../components/InfosLegales/InfosLegales.svelte";
    import DataNotFound from "../../components/DataNotFound.svelte";
    import FullPageSpinner from "../../components/FullPageSpinner.svelte";
    import StructureTitle from "../../components/StructureTitle/StructureTitle.svelte";
    import TabsAsso from "./components/TabsAsso.svelte";
    import { AssociationController } from "./Association.controller";

    export let id;

    const controller = new AssociationController(id);
    const { association: associationPromise, titles } = controller;
</script>

{#await associationPromise}
    <FullPageSpinner description="Chargement de l'association {id} en cours ..." />
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
        <TabsAsso {titles} associationIdentifier={id} {association} />
    </div>
{:catch error}
    {#if error.request && error.request.status == 404}
        <DataNotFound />
    {:else}
        <ErrorAlert message={error.message} />
    {/if}
{/await}
