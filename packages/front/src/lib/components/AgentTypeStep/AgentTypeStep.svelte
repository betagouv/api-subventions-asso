<script>
    import AgentTypeStepController from "./AgentTypeStep.controller";
    import Radio from "$lib/dsfr/Radio.svelte";

    export let values = {
        agentType: null,
    };
    export let context = {};

    const ctrl = new AgentTypeStepController(context);
    const { errorMessage } = ctrl;
</script>

<Radio
    options={ctrl.options}
    label="Vous êtes :"
    bind:value={values.agentType}
    on:change={({ detail }) => ctrl.onUpdate(detail)}
    errorMsgHtml={$errorMessage} />
