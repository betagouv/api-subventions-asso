<script>
    import { PAGE_ADMIN_STATS_NAME } from "../admin.constant";
    import TopAssociations from "./components/TopAssociations/TopAssociations.svelte";
</script>

<h1 class="fr-h2">{PAGE_ADMIN_STATS_NAME}</h1>

<div class="fr-grid-row">
    <!-- TODO fréquences moyenne requêtes mensuelles par utilisateur -->
    <TopAssociations />
</div>
<div class="fr-grid-row">
    <!-- TODO Fréquence d’usage : Nombre total de requêtes -->
</div>

<style></style>
