<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { depositLogStore } from "$lib/store/depositLog.store";
    import ResumeFormController from "./ResumeForm.controller";

    const ctrl = new ResumeFormController();
    const dispatch = createEventDispatcher<{ resume: void; restart: void }>();

    async function handleRestartDeposit() {
        const success = await ctrl.handleRestartDeposit();
        if (success) {
            dispatch("restart");
        }
    }
</script>

<div class="fr-col-12 fr-col-lg-11">
    <h1 class="text-center fr-mb-10v">Finalisez votre dépôt de données au format SCDL</h1>

    {#if $depositLogStore?.step === 1}
        <div class="fr-text">
            <p class="fr-mb-7v">
                Vous avez commencé un dépôt de données pour l’attribuant au SIRET n°
                <span class="fr-text--bold">{$depositLogStore.allocatorSiret}</span>
                .
                <br />
                Il vous reste plusieurs étapes avant de finaliser le dépôt de vos données.
            </p>
        </div>
    {/if}

    <div>
        <button on:click={() => dispatch("resume")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Reprendre mon dépôt
        </button>

        <button on:click={handleRestartDeposit} class="fr-btn fr-mr-3v" type="button">
            Commencer un nouveau dépôt
        </button>
    </div>
</div>
