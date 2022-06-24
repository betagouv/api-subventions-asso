<script>
    import associationService from "./association.service.js";
    import Breadcrumb from "../../dsfr/Breadcrumb.svelte";
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
    <p>Fetching association...</p>
{:then association}
    <InfosLegales {association} />
    <TabsAsso {titles} />
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
