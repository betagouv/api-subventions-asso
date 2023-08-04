<script>
    // import PasswordErrorAlert from "$lib/components/DefinePassword/PasswordErrorAlert.svelte";
    import ActivateAccount from "./ActivateAccount.controller";
    import MultiStepForm from "$lib/components/MultiStepForm/MultiStepForm.svelte";

    export let data;
    const { token } = data.params;

    const controller = new ActivateAccount(token);
</script>

<h1>Créer votre compte</h1>

<!-- TODO: handle token error display
<PasswordErrorAlert {error} /> -->

<MultiStepForm
    steps={controller.steps}
    onSubmit={values => controller.onSubmit(values)}
    submitLabel="Valider l'inscription" />
