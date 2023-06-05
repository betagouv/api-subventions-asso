<script>
    import Announcement from "./Announcement.svelte";
    import BodaccController from "./Bodacc.controller";
    import Alert from "@dsfr/Alert.svelte";

    export let bodacc;

    const { announcements } = new BodaccController(bodacc);
</script>

<div class="bodacc">
    <h2>Historique des publications</h2>
    <Alert type="info" title="Qu’est-ce que le BODACC ?">
        Le Bulletin officiel des annonces civiles et commerciales (BODACC) est le journal d'annonces légales qui
        répertorie les actes enregistrés au registre du commerce et des sociétés (RCS) : créations, immatriculations,
        ventes et cessions, procédures collectives, procédures de conciliation, procédures de rétablissement
        professionnel, modifications, radiations et dépôt des comptes.
    </Alert>

    {#if announcements}
        <div class="fr-mt-17v">
            {#each announcements as announcement}
                <Announcement {announcement} />
            {/each}
        </div>
    {:else}
        <Alert type="info" title="Il n'y a pas de résultat pour cette association" />
    {/if}
</div>
