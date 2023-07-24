<script>
    import ActivateAccount from "./ActivateAccount.controller";
    import MultiStepForm from "@components/MultiStepForm/MultiStepForm.svelte";

    const controller = new ActivateAccount();

    function onSubmit(values) {
        console.log("multi step submit", values);
    }
</script>

<h1>Créer votre compte</h1>

<MultiStepForm steps={controller.steps} {onSubmit} />
