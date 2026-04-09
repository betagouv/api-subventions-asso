<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Upload from "$lib/dsfr/Upload.svelte";
    import { createEventDispatcher } from "svelte";
    import SheetSelector from "./SheetSelector.svelte";
    import Step2Controller from "./Step2.controller";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";
    import OverwriteExercices from "./OverwriteExercices.svelte";

    const dispatch = createEventDispatcher<{
        prevStep: void;
        nextStep: void;
        loading: string;
        endLoading: void;
        error: string;
    }>();
    const ctrl = new Step2Controller(dispatch);
    const {
        noFileOrInvalid,
        excelSheets,
        view,
        uploadErrorMessage,
        uploadError,
        uploadConfig,
        errorAlertVisible,
        allocatorSiret,
        allocatorName,
    } = ctrl;

    const infoBoxTitle = "Nous acceptons uniquement des fichiers au format CSV ou XLS. ";
    const checkboxOptions = [
        {
            label: "Je confirme que j’ai l’accord ou l’autorité pour déposer ce fichier de données pour ma structure.",
            value: "agreement",
        },
    ];
    let selectedValues: string[] = [];
</script>

<div>
    {#if $view === "sheetSelector"}
        <SheetSelector
            excelSheets={$excelSheets}
            on:sheetSelected={e => ctrl.handleSheetSelected(e)}
            on:restartUpload={() => ctrl.handleRestartUpload()} />
    {:else if $view === "overwriteExercices"}
        <OverwriteExercices
            on:validate={e => ctrl.uploadFile(undefined, e.detail.checkedExercises)}
            on:toFileSelect={() => ctrl.goToFileSelection()} />
    {:else}
        <div>
            <div class="fr-mb-6v">
                <Alert
                    type="error"
                    title="Une erreur empêche la lecture de votre fichier"
                    closeButton={true}
                    bind:visible={$errorAlertVisible}>
                    <p>
                        Nous vous invitons à réessayer de faire votre dépôt. Si le problème persiste, merci de bien
                        vouloir contacter notre support via la bulle de chat.
                    </p>
                </Alert>
            </div>

            <div class="fr-mb-6v">
                <InfoBox title={infoBoxTitle}>
                    <p class="fr-mb-4">
                        Les fichiers PDF ne permettent pas de traitement automatisé, car ils figent l'information sous
                        forme de texte ou d'image, rendant les données inexploitables. <br />
                    </p>
                    <p class="fr-mb-4">
                        Pour préparer votre fichier, vous pouvez vous appuyer sur
                        <TargetBlankLink
                            href="https://datasubvention.beta.gouv.fr/wp-content/uploads/2024/12/Gabarit-SCDL-202410.xlsx">
                            notre modèle SCDL
                        </TargetBlankLink>
                        .
                    </p>
                    <h3 class="fr-text--lg fr-text--bold">Besoin d'aide ?</h3>
                    <p class="fr-mb-0">
                        Venez poser vos questions lors du webinaire d’accompagnement sur le dépôt de données au format
                        SCDL :
                        <TargetBlankLink
                            href="https://datasubvention.beta.gouv.fr/permanence-scdl-creer-structurer-et-deposer-vos-donnees/">
                            s'inscrire
                        </TargetBlankLink>
                    </p>
                </InfoBox>
            </div>

            <div class="fr-mb-6v">
                <span class="fr-text--bold">SIRET de l’attribuant indiqué :</span>
                <br />
                {allocatorSiret}
                {#if allocatorName}
                    - {allocatorName}{/if}
            </div>

            <div class="fr-mb-6v">
                <Checkbox options={checkboxOptions} bind:value={selectedValues} />
            </div>

            <div class="fr-mb-6v">
                <Upload
                    label={uploadConfig.label}
                    hint={uploadConfig.hint}
                    disabled={!selectedValues.includes(checkboxOptions[0].value)}
                    acceptedFormats={uploadConfig.acceptedFormats}
                    error={$uploadError}
                    errorMessage={$uploadErrorMessage}
                    name="file"
                    on:fileChange={e => ctrl.handleFileChange(e)} />
            </div>

            <div>
                <button on:click={() => dispatch("prevStep")} class="fr-btn fr-btn--secondary fr-mr-3v" type="button">
                    Retour
                </button>

                <button
                    on:click={() => ctrl.handleValidate()}
                    disabled={$noFileOrInvalid || !selectedValues.includes(checkboxOptions[0].value)}
                    class="fr-btn fr-mr-3v"
                    type="button">
                    Poursuivre l'import
                </button>
            </div>
        </div>
    {/if}
</div>
