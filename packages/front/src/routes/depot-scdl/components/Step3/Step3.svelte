<script lang="ts">
    import Alert from "$lib/dsfr/Alert.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import Checkbox from "$lib/dsfr/Checkbox.svelte";
    import Upload from "$lib/dsfr/Upload.svelte";
    import { createEventDispatcher } from "svelte";
    import SheetSelector from "./SheetSelector.svelte";
    import Step3Controller from "./Step3.controller";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";

    const dispatch = createEventDispatcher<{
        prevStep: void;
        nextStep: void;
        loading: string;
        endLoading: void;
        error: string;
    }>();
    const ctrl = new Step3Controller(dispatch);
    const { noFileOrInvalid, excelSheets, view, uploadErrorMessage, uploadError, uploadConfig, errorAlertVisible } =
        ctrl;

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
    {:else}
        <div>
            <div class="fr-mb-6v">
                <Alert
                    type="error"
                    title="Une erreur empêche la lecture de votre fichier"
                    closeButton={true}
                    bind:visible={$errorAlertVisible}>
                    <p>
                        Merci de réessayer ultérieurement. Si le problème persiste, vous pouvez recharger la page ou
                        contacter notre support via la bulle de chat.
                    </p>
                </Alert>
            </div>

            <div class="fr-mb-6v">
                <InfoBox title={infoBoxTitle}>
                    <p>
                        Les fichiers PDF ne permettent pas de traitement automatisé, car ils figent l'information sous
                        forme de texte ou d'image, rendant les données difficilement exploitables.
                    </p>
                    <p class="fr-mb-0">
                        Pour préparer votre fichier, vous pouvez vous appuyer
                        <TargetBlankLink
                            href="https://www.notion.so/R-gles-de-format-SCDL-1281788663a380e1a57efdd9b324c1ba">
                            nos modèles SCDL
                        </TargetBlankLink>
                        .
                    </p>
                </InfoBox>
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
                    Valider
                </button>
            </div>
        </div>
    {/if}
</div>
