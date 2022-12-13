<script>
    import { isAssociation } from "../../helpers/entrepriseHelper";
    import associationService from "./association.service.js";
    import Alert from "../../dsfr/Alert.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "../../components/InfosLegales.svelte";
    import TabsAsso from "./components/TabsAsso.svelte";
    import DataNotFound from "../../components/DataNotFound.svelte";
    import RnaSiren from "./components/RnaSiren.svelte";

    export let id;

    const titles = ["Tableau de bord", "Pièces administratives", "Établissements"];
    let promise = associationService.getAssociation(id);
</script>

{#await promise}
    <Spinner description="Chargement de l'association {id} en cours ..." />
{:then association}
    {#if !association.rna && !isAssociation(association.categorie_juridique)}
        <Alert type="warning" title="Attention">
            Il semblerait que vous cherchiez une entreprise et non une association
        </Alert>
    {/if}
    <InfosLegales {association}>
        <RnaSiren {association} />
    </InfosLegales>
    <TabsAsso {titles} associationIdentifier={id} {association} />
{:catch error}
    {#if error.request && error.request.status == 404}
        <DataNotFound />
    {:else}
        <ErrorAlert message={error.message} />
    {/if}
{/await}
