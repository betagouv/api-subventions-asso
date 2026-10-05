<script lang="ts">
    import Step3Controller from "./Step3.controller";
    import MultipleAllocators from "./MultipleAllocators/MultipleAllocators.svelte";
    import LessGrantData from "./LessGrantData/LessGrantData.svelte";
    import BlockingErrors from "./BlockingErrors/BlockingErrors.svelte";
    import ConfirmDataAdd from "./ConfirmDataAdd/ConfirmDataAdd.svelte";
    import MissingHeaders from "./MissingHeaders/MissingHeaders.svelte";
    import NeedHelpInfoBox from "../NeedHelpInfoBox.svelte";

    let {
        prevStep = () => {},
        nextStep = () => {},
        loading = (_message: string) => {},
        endLoading = () => {},
        restartNewForm = () => {},
    } = $props();
    const dispatch = (event: string, detail?: string) => {
        if (event === "prevStep") prevStep();
        else if (event === "nextStep") nextStep();
        else if (event === "loading") loading(detail ?? "");
        else if (event === "endLoading") endLoading();
        else if (event === "restartNewForm") restartNewForm();
    };
    const ctrl = new Step3Controller(dispatch);
    const { view } = ctrl;
</script>

<div>
    <div class="fr-grid-row fr-grid-row--gutters">
        {#if $view === "missingHeaders"}
            <MissingHeaders prevStep={() => ctrl.handlePrevStep()} restartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "multipleAllocator"}
            <MultipleAllocators
                prevStep={() => ctrl.handlePrevStep()}
                restartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "lessGrantData"}
            <LessGrantData prevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "blockingErrors"}
            <BlockingErrors prevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "confirmDataAdd"}
            <ConfirmDataAdd prevStep={() => ctrl.handlePrevStep()} submitDatas={() => ctrl.submitDatas()} />
        {/if}

        <div class="fr-col-12 fr-col-md-4">
            <NeedHelpInfoBox />
        </div>
    </div>
</div>
