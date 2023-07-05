<script>
    import ExampleStepController from "./ExampleStep.controller";

    export let standalone = true;

    // those three values must not be used. Use ctrl methods instead
    // however the first two are mandatory for a multistep form
    export let initialValues;
    export let onSubmit;
    export let onBack;
    const formConfig = { onSubmit, onBack, initialValues }; // you can configure more cf felte

    // cannot be defined in the controller because it needs to be exported the svelte way. it should not be read, use reactiveData instead
    export let data;

    // those 4 lines are mandatory for a step's component
    const ctrl = new ExampleStepController(formConfig, standalone);
    ctrl.init();
    const { form, data: reactiveData } = ctrl.createdForm; // you can get more cf felte
    $: data = $reactiveData;
</script>

{#if standalone}
    <h1>Page de formulaire</h1>
{/if}

<!-- the attribute use:form is mandatory-->
<form use:form>
    <label for="firstName">First name</label>
    <input id="firstName" name="firstName" />
    <label for="lastName">Last name</label>
    <input id="lastName" name="lastName" />
    <br />

    {#if !ctrl.standalone}
        <button type="button" on:click={() => onBack($reactiveData)} disabled={!ctrl.formConfig.onBack}>
            Previous page
        </button>
    {/if}
    <button type="submit">Next page</button>
</form>
