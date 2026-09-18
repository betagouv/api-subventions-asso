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

    const ctrl = new AgentTypeStepController(context, event => (event === "error" ? onerror() : onvalid()));
    const { errorMessage } = ctrl;
</script>

<Radio
    options={ctrl.options}
    label="Vous êtes :"
    bind:value={values.agentType}
    onchange={detail => ctrl.onUpdate(detail)}
    errorMsgHtml={$errorMessage} />
