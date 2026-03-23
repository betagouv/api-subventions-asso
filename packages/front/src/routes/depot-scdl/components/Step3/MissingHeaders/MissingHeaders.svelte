<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import { createEventDispatcher } from "svelte";
    import depositLogService from "$lib/resources/deposit-log/depositLog.service";
    import MissingHeadersController from "./MissingHeaders.controller";

    const dispatch = createEventDispatcher<{ prevStep: void }>();
    const { missingMandatoryHeaders, missingOptionalHeaders } = new MissingHeadersController();
</script>

<div class="fr-col-12 fr-col-md-8">
    <Alert type="error" title="Des colonnes obligatoires sont manquantes ou mal nommées dans votre fichier">
        <p>Compte tenu de ces erreurs votre fichier n'a pas pu être analysé.</p>
    </Alert>

    <p>
        Pour analyser votre fichier nous avons besoin que les noms des colonnes (en première ligne) soient présentes et
        correctement nommées
    </p>
    <p>
        Les colonnes concernées sont obligatoires pour procéder au dépôt :
        <br />
        <strong>{missingMandatoryHeaders.join(", ")}</strong>
    </p>

    {#if missingOptionalHeaders.length > 0}
        <p>
            Des colonnes optionnelles sont manquantes ou mal nommées :
            <br />
            <strong>{missingOptionalHeaders.join(", ")}</strong>
        </p>
        <p>Vous pouvez mettre votre fichier à jour pour améliorer la qualité du dépôt</p>
    {/if}

    <div class="fr-mt-4v">
        <button on:click={() => dispatch("prevStep")} class="fr-btn fr-mr-3v" type="button">
            Réimporter mon fichier
        </button>

        <button
            on:click={() => depositLogService.restartNewDeposit(dispatch)}
            class="fr-btn fr-btn--secondary fr-mr-3v"
            type="button">
            Recommencer un nouveau dépôt
        </button>
    </div>
</div>
