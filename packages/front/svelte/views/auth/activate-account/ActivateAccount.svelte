<script>
    // import PasswordErrorAlert from "../define-password/PasswordErrorAlert.svelte";
    import ActivateAccount from "./ActivateAccount.controller";
    import MultiStepForm from "@components/MultiStepForm/MultiStepForm.svelte";

    export let token;

    const controller = new ActivateAccount(token);
</script>

<h1>Créer votre compte</h1>

<!-- TODO: handle token error display
<PasswordErrorAlert {error} /> -->

<MultiStepForm
    steps={controller.steps}
    onSubmit={values => controller.onSubmit(values)}
    submitLabel="Valider l'inscription" />
