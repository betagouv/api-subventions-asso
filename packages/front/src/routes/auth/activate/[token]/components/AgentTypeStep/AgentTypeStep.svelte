<script>
    import AgentTypeStepController from "./AgentTypeStep.controller";
    import Radio from "$lib/dsfr/Radio.svelte";

    export let values = {
        agentType: null,
    };

    const ctrl = new AgentTypeStepController(values);
    const { options } = ctrl;
</script>

<Radio
    options={$options}
    label="Vous êtes :"
    bind:value={values.agentType}
    on:change={({ detail }) => ctrl.onUpdate(detail)} />
