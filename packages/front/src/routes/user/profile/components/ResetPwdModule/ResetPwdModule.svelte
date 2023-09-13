<script>
    import { ResetPwdModuleController } from "./ResetPwdModule.controller";
    import Button from "$lib/dsfr/Button.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";

    export let email;

    const ctrl = new ResetPwdModuleController(email);
    const { status } = ctrl;
</script>

{#if $status === "success"}
    <Alert small={true} type="success">Un e-mail de modification de mot de passe vous a été envoyé.</Alert>
{:else if $status === "error"}
    <Alert small={true} type="error">
        Une erreur est survenue. Si l'erreur persiste, vous pouvez nous contacter à <a
            href="mailto:{ctrl.contactEmail}">
            {ctrl.contactEmail}
        </a>
        .
    </Alert>
{/if}
<Button
    trackerName="profile.forget-password"
    type="tertiary"
    outline={false}
    disabled={$status === "success"}
    on:click={() => ctrl.onClick()}>
    Réinitialiser votre mot de passe
</Button>
<!-- TODO check button type -->
