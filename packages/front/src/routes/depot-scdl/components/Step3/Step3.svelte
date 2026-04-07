<script lang="ts">
    import Step3Controller from "./Step3.controller";
    import MultipleAllocators from "./MultipleAllocators/MultipleAllocators.svelte";
    import LessGrantData from "./LessGrantData/LessGrantData.svelte";
    import { createEventDispatcher } from "svelte";
    import BlockingErrors from "./BlockingErrors/BlockingErrors.svelte";
    import ConfirmDataAdd from "./ConfirmDataAdd/ConfirmDataAdd.svelte";
    import MissingHeaders from "./MissingHeaders/MissingHeaders.svelte";
    import NeedHelpInfoBox from "../NeedHelpInfoBox.svelte";

    const dispatch = createEventDispatcher<{
        prevStep: void;
        nextStep: void;
        loading: void;
        endLoading: void;
        restartNewForm: void;
    }>();
    const ctrl = new Step3Controller(dispatch);
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
            <NeedHelpInfoBox />
        </div>
    </div>
</div>
