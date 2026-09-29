<script lang="ts">
    import AgentTypeStepController from "./AgentTypeStep.controller";
    import Radio from "$lib/dsfr/Radio.svelte";

    let {
        values = $bindable({
            agentType: null,
        }),
        context = {},
        onerror = () => {},
        onvalid = () => {},
    } = $props();

    const ctrl = $derived(new AgentTypeStepController(context, event => (event === "error" ? onerror() : onvalid())));
    const errorMessage = $derived(ctrl.errorMessage);
    let agentType = $derived(values.agentType);

    function updateAgentType(detail: Parameters<typeof ctrl.onUpdate>[0]) {
        values.agentType = agentType;
        ctrl.onUpdate(detail);
    }
</script>

<Radio
    options={ctrl.options}
    label="Vous êtes :"
    bind:value={agentType}
    onchange={detail => updateAgentType(detail)}
    errorMsgHtml={$errorMessage} />
