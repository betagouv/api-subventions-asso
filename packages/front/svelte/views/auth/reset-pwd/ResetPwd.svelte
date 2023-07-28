<script>
    import PasswordFormatAlert from "../define-password/PasswordFormatAlert.svelte";
    import PasswordErrorAlert from "../define-password/PasswordErrorAlert.svelte";
    import DefinePassword from "../define-password/DefinePassword.svelte";
    import { ResetPwdController } from "./ResetPwd.controller";
    import Button from "@dsfr/Button.svelte";
    import Spinner from "@components/Spinner.svelte";

    export let token;

    const ctrl = new ResetPwdController(token);
    const { promise, values, isSubmitActive } = ctrl;
</script>

<div class="fr-container fr-mb-8w">
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col fr-col-lg-8">
            <h1>{ctrl.title}</h1>

            <PasswordFormatAlert />

            {#await $promise}
                <div class="fr-mb-5w fr-mt-n4w">
                    <Spinner />
                </div>
            {:catch error}
                <PasswordErrorAlert {error} />
            {/await}

            <form action="#" method="GET" on:submit|preventDefault={() => ctrl.onSubmit()}>
                <DefinePassword
                    on:error={() => ctrl.disableSubmit()}
                    on:valid={() => ctrl.enableSubmit()}
                    bind:values={$values} />
                <div class="fr-input-group">
                    <Button type="submit" title="Valider" htmlType="submit" disabled={!$isSubmitActive}>Valider</Button>
                </div>
            </form>
        </div>
    </div>
</div>
