<script>
    import ResumeFormController from "./ResumeForm.controller";
    import { onMount } from "svelte";

    const ctrl = new ResumeFormController();
    let depositLog;

    onMount(async () => {
        depositLog = await ctrl.loadDepositLog();
    });
</script>

<div class="fr-container fr-mt-14v">
    <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-lg-11">
            <h1 class="text-center fr-mb-10v">Finalisez votre dépôt de données au format SCDL</h1>

            {#if depositLog?.step === 1}
                <div class="fr-text">
                    <p class="fr-mb-7v">
                        Vous avez commencé un dépôt de données pour l’attribuant au SIRET n°
                        <span class="fr-text--bold">{depositLog.allocatorSiret}</span>
                        .
                        <br />
                         Il vous reste plusieurs étapes avant de finaliser le dépôt de vos données.
                    </p>
                </div>
            {/if}

            <div>
                <button
                    on:click={() => {
                        ctrl.resumeForm(depositLog?.step);
                    }}
                    class="fr-btn fr-btn--secondary fr-mr-3v"
                    type="button">
                    Reprendre mon dépôt
                </button>

                <button on:click={ctrl.newDeposit} class="fr-btn fr-mr-3v" type="button">
                    Commencer un nouveau dépôt
                </button>
            </div>
        </div>
    </div>
</div>
