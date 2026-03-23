<script lang="ts">
    import Step4Controller from "./Step4.controller";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import MultipleAllocators from "./MultipleAllocators/MultipleAllocators.svelte";
    import LessGrantData from "./LessGrantData/LessGrantData.svelte";
    import { createEventDispatcher } from "svelte";
    import BlockingErrors from "./BlockingErrors/BlockingErrors.svelte";
    import ConfirmDataAdd from "./ConfirmDataAdd/ConfirmDataAdd.svelte";
    import TargetBlankLink from "$lib/components/TargetBlankLink.svelte";
    import MissingHeaders from "./MissingHeaders/MissingHeaders.svelte";

    const dispatch = createEventDispatcher<{
        prevStep: void;
        nextStep: void;
        loading: void;
        endLoading: void;
        restartNewForm: void;
    }>();
    const ctrl = new Step4Controller(dispatch);
    const { view } = ctrl;
</script>

<div>
    <div class="fr-grid-row fr-grid-row--gutters">
        {#if $view === "missingHeaders"}
            <MissingHeaders
                on:prevStep={() => ctrl.handlePrevStep()}
                on:restartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "multipleAllocator"}
            <MultipleAllocators
                on:prevStep={() => ctrl.handlePrevStep()}
                on:restartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "lessGrantData"}
            <LessGrantData on:prevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "blockingErrors"}
            <BlockingErrors on:prevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "confirmDataAdd"}
            <ConfirmDataAdd on:prevStep={() => ctrl.handlePrevStep()} on:submitDatas={() => ctrl.submitDatas()} />
        {/if}

        <div class="fr-col-12 fr-col-md-4">
            <InfoBox title="Besoin d’aide ?">
                <ul>
                    <li class="fr-mb-2v">
                        Consulter la documentation officielle pour plus d’informations :
                        <br />
                        <TargetBlankLink href="https://schema.data.gouv.fr/scdl/subventions/">
                            Voir la documentation
                        </TargetBlankLink>
                    </li>
                    <li class="fr-mb-2v">
                        Préparer votre fichier en vous appuyant sur
                        <TargetBlankLink
                            href="https://datasubvention.beta.gouv.fr/wp-content/uploads/2024/12/Gabarit-SCDL-202410.xlsx">
                            notre modèle SCDL
                        </TargetBlankLink>
                    </li>
                    <li class="fr-mb-2v">Nous contacter via la bulle de chat</li>
                    <li>
                        Participer à notre webinaire pour plus d’accompagnement dans la mise à jour de votre fichier :
                    </li>
                    <TargetBlankLink
                        href="https://datasubvention.beta.gouv.fr/permanence-scdl-creer-structurer-et-deposer-vos-donnees/">
                        S'inscrire
                    </TargetBlankLink>
                </ul>
            </InfoBox>
        </div>
    </div>
</div>
