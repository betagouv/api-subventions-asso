<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import ResumeFormController from "./ResumeForm.controller";

    const ctrl = new ResumeFormController();
    const { fileInfos, currentView, subTitle, descState, allocatorSiret, formattedDate, filename } = ctrl;
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

    {#if currentView !== "siretView" && currentView !== "confirmDataAdd"}
        <h3 class="fr-text--lead">{subTitle}</h3>
    {/if}

    <div class="fr-text">
        <p class="fr-mb-7v">
            Vous avez commencé un dépôt de données pour l’attribuant au SIRET n°
            <span class="fr-text--bold">{allocatorSiret}</span>
            .
            <br />
            {descState}
        </p>
    </div>

    {#if currentView !== "siretView"}
        <p>
            <strong class="fr-text--lg">Fichier déposé :</strong>
            <br />
            📅 Le {formattedDate}
            <br />
            📄 Fichier déposé :
            <a class="fr-link fr-link--download" href="/" on:click|preventDefault={() => ctrl.generateDownloadUrl()}>
                {filename}
            </a>
        </p>
    {/if}

    {#if currentView === "blockingErrors" && fileInfos}
        <p>
            Veuillez télécharger le rapport pour consulter les erreurs, corriger votre fichier, puis le déposer à
            nouveau.
            <br />
            <a class="fr-link fr-link--download" href="/" on:click|preventDefault={() => ctrl.downloadErrorFile()}>
                Télécharger le rapport d'erreurs
            </a>
        </p>
    {/if}

    <div>
        <button on:click={() => dispatch("resume")} class="fr-btn fr-mr-3v" type="button">Reprendre mon dépôt</button>

        <button on:click={handleRestartDeposit} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
            Commencer un nouveau dépôt
        </button>
    </div>
</div>
