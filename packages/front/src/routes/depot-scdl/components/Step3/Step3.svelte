<script lang="ts">
    import Step3Controller from "./Step3.controller";
    import MultipleAllocators from "./MultipleAllocators/MultipleAllocators.svelte";
    import LessGrantData from "./LessGrantData/LessGrantData.svelte";
    import BlockingErrors from "./BlockingErrors/BlockingErrors.svelte";
    import ConfirmDataAdd from "./ConfirmDataAdd/ConfirmDataAdd.svelte";
    import MissingHeaders from "./MissingHeaders/MissingHeaders.svelte";
    import NeedHelpInfoBox from "../NeedHelpInfoBox.svelte";

    let {
        onprevStep = () => {},
        onnextStep = () => {},
        onloading = (_message: string) => {},
        onendLoading = () => {},
        onrestartNewForm = () => {},
    } = $props();
    const dispatch = (event: string, detail?: string) => {
        if (event === "prevStep") onprevStep();
        else if (event === "nextStep") onnextStep();
        else if (event === "loading") onloading(detail ?? "");
        else if (event === "endLoading") onendLoading();
        else if (event === "restartNewForm") onrestartNewForm();
    };
    const ctrl = new Step3Controller(dispatch);
    const { view } = ctrl;
</script>

<div>
    <div class="fr-grid-row fr-grid-row--gutters">
        {#if $view === "missingHeaders"}
            <MissingHeaders
                onprevStep={() => ctrl.handlePrevStep()}
                onrestartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "multipleAllocator"}
            <MultipleAllocators
                onprevStep={() => ctrl.handlePrevStep()}
                onrestartNewForm={() => ctrl.handleRestartNewForm()} />
        {:else if $view === "lessGrantData"}
            <LessGrantData onprevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "blockingErrors"}
            <BlockingErrors onprevStep={() => ctrl.handlePrevStep()} />
        {:else if $view === "confirmDataAdd"}
            <ConfirmDataAdd onprevStep={() => ctrl.handlePrevStep()} onsubmitDatas={() => ctrl.submitDatas()} />
        {/if}

        <div class="fr-col-12 fr-col-md-4">
            <NeedHelpInfoBox />
        </div>
    </div>
</div>
