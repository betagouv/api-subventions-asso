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
        La direction de l’information légale et administrative (DILA), service du Premier ministre, a pour mission de
        publier et de diffuser les textes législatifs et réglementaires, les débats parlementaires ainsi que certaines
        annonces officielles concernant les entreprises, les associations et les marchés publics. La DILA édite le
        Bulletin officiel des annonces civiles et commerciales (BODACC) dans le cadre de sa mission de service public de
        la transparence économique et financière.
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
