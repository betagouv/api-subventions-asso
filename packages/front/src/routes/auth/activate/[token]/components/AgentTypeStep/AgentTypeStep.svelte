<script>
    import AgentTypeStepController from "./AgentTypeStep.controller";
    import Radio from "$lib/dsfr/Radio.svelte";

    export let values = {
        agentType: null,
    };

    const ctrl = new AgentTypeStepController(values);
    const { errorMessage } = ctrl;
</script>

<Radio
    options={ctrl.options}
    label="Vous êtes :"
    bind:value={values.agentType}
    on:change={({ detail }) => ctrl.onUpdate(detail)}
    errorMsgHtml={$errorMessage} />
