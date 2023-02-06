<script>
    import { isAssociation } from "../../helpers/entrepriseHelper";
    import associationService from "./association.service.js";
    import { activeBlueBanner } from "../../store/context.store";

    import Alert from "../../dsfr/Alert.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "../../components/InfosLegales/InfosLegales.svelte";
    import TabsAsso from "./components/TabsAsso.svelte";
    import DataNotFound from "../../components/DataNotFound.svelte";
    import FullPageSpinner from "../../components/FullPageSpinner.svelte";
    import StructureTitle from "../../components/StructureTitle/StructureTitle.svelte";

    export let id;

    activeBlueBanner();

    const titles = ["Tableau de bord", "Statistiques", "Pièces administratives", "Établissements"];
    let promise = associationService.getAssociation(id);
</script>

{#await promise}
    <FullPageSpinner description="Chargement de l'association {id} en cours ..." />
{:then association}
    {#if !association.rna && !isAssociation(association.categorie_juridique)}
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
