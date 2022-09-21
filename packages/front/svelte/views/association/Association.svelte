<script>
    import { isAssociation } from "../../helpers/entrepriseHelper";
    import associationService from "./association.service.js";

    import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
    import Alert from "../../dsfr/Alert.svelte";

    import Spinner from "../../components/Spinner.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "./components/InfosLegales.svelte";
    import TabsAsso from "./components/TabsAsso.svelte";
    import DataNotFound from "../../components/DataNotFound.svelte";

    export let route = "";
    const routeSegments = route.split("/");
    const id = routeSegments[routeSegments.length - 1];

    let promise = associationService.getAssociation(id);

    const titles = ["Tableau de bord", "Pièces administratives", "Établissements"];

    const segments = [{ label: "Accueil", url: "/" }, { label: `Association (${id})` }];
</script>

<Breadcrumb {segments} />
{#await promise}
    <Spinner description="Chargement de l'association {id} en cours ..." />
{:then association}
    {#if !association.rna && !isAssociation(association.categorie_juridique)}
        <Alert type="warning" title="Attention">
            Il semblerait que vous cherchiez une entreprise et non une association
        </Alert>
    {/if}
    <InfosLegales {association} />
    <TabsAsso {titles} associationIdentifier={id} {association} />
{:catch error}
    {#if error.request && error.request.status == 404}
        <DataNotFound />
    {:else}
        <ErrorAlert message={error.message} />
    {/if}
{/await}
