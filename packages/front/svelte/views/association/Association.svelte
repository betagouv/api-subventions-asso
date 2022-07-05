<script>
    import associationService from "./association.service.js";
    import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
    import Spinner from "../../components/Spinner.svelte";
    import ErrorAlert from "../../components/ErrorAlert.svelte";
    import InfosLegales from "./components/InfosLegales.svelte";
    import TabsAsso from "./components/TabsAsso.svelte";

    export let route = "";
    const routeSegments = route.split("/");
    const id = routeSegments[routeSegments.length - 1];

    let promise = associationService.getAssociation(id);

    const titles = ["Tableau de bord des subventions", "Pièces administratives", "Établissements"];

    const segments = [{ label: "Accueil", url: "/" }, { label: `Association (${id})` }];
</script>

<Breadcrumb {segments} />
{#await promise}
    <Spinner description="Chargement de l'association {id} en cours ..." />
{:then association}
    <InfosLegales {association} />
    <TabsAsso {titles} associationIdentifier={id} {association} />
{:catch error}
    <ErrorAlert message={error.message} />
{/await}
