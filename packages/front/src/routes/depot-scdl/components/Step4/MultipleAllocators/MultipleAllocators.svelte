<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import MultipleAllocatorsController from "./MultipleAllocators.controller";
    import { depositLogStore } from "$lib/store/depositLog.store";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ prevStep: void; restartNewForm: void; error: string }>();
    const ctrl = new MultipleAllocatorsController(dispatch);
</script>

<div class="fr-col-12 fr-col-md-8">
    <Alert type="error" title="Le SIRET attribuant de votre fichier ne correspond pas à celui indiqué">
        <p>Votre fichier n’est donc pas pris en compte.</p>
    </Alert>

    <p>
        Vous avez renseigné au début du parcours le SIRET attribuant suivant :
        <br />
        <strong>{$depositLogStore?.allocatorSiret}</strong>
    </p>
    <p>
        Or, votre fichier contient des données pour d’autres SIRET attribuant :
        <br />
        <strong>
            {#if $depositLogStore?.uploadedFileInfos}
                {$depositLogStore.uploadedFileInfos.allocatorsSiret
                    .filter(siret => siret !== $depositLogStore.allocatorSiret)
                    .join(", ")}
            {/if}
        </strong>
    </p>
    <p>
        Pour des raisons de cohérence et de sécurité, vous ne pouvez déposer que des données correspondant au SIRET
        attribuant initialement indiqué.
    </p>
    <p>Que pouvez-vous faire ?</p>
    <ul>
        <li>
            Corriger votre fichier pour qu’il corresponde bien au SIRET attribuant : {$depositLogStore?.allocatorSiret}
        </li>
        <li>Recommencer le parcours si vous vous êtes trompé de SIRET au départ</li>
    </ul>

    <div class="fr-mt-4v">
        <button on:click={() => ctrl.restartUploadFile()} class="fr-btn fr-mr-3v" type="button">
            Réimporter mon fichier
        </button>

        <button on:click={() => ctrl.restartNewDeposit()} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Recommencer un nouveau dépôt
        </button>
    </div>
</div>
