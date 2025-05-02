<script>
    import { onMount } from "svelte";
    import Announcement from "./Announcement.svelte";
    import BodaccController from "./Bodacc.controller";
    import Alert from "$lib/dsfr/Alert.svelte";

    export let bodacc;
    let element;

    const ctrl = new BodaccController(bodacc);
    const { announcements } = ctrl;
    onMount(() => ctrl.onMount(element));
</script>

<div class="bodacc" bind:this={element}>
    <h2>Historique des publications</h2>
    <Alert type="info" title="Qu’est-ce que le BODACC ?">
        Le Bulletin officiel des annonces civiles et commerciales (BODACC) est le journal d'annonces légales qui
        répertorie les actes enregistrés au registre du commerce et des sociétés (RCS) : créations, immatriculations,
        ventes et cessions, procédures collectives, procédures de conciliation, procédures de rétablissement
        professionnel, modifications, radiations et dépôt des comptes.
    </Alert>

    {#if announcements}
        <div class="fr-mt-17v">
            {#each announcements as announcement, index (index)}
                <Announcement {announcement} />
            {/each}
        </div>
    {:else}
        <Alert type="info" title="Il n'y a pas de résultat pour cette association" />
    {/if}
</div>
