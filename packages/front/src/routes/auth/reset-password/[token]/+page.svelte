<script>
    import { ResetPwdController } from "./ResetPwd.controller";
    import PasswordFormatAlert from "$lib/components/DefinePassword/PasswordFormatAlert.svelte";
    import PasswordErrorAlert from "$lib/components/DefinePassword/PasswordErrorAlert.svelte";
    import DefinePassword from "$lib/components/DefinePassword/DefinePassword.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    export let data;
    const { token } = data.params;

    const ctrl = new ResetPwdController(token);

    ctrl.init();
    const { promise, values, isSubmitActive, validationTokenStore, title } = ctrl;
</script>

<div class="fr-mb-8w">
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col fr-col-lg-8">
            {#if $validationTokenStore === "waiting"}
                <div class="fr-mb-5w fr-mt-n4w">
                    <Spinner />
                </div>
            {:else if $validationTokenStore === "invalid"}
                <PasswordErrorAlert error={ctrl.error} />
            {:else}
                <h1>{title}</h1>

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
                    <div class="fr-input-group fr-my-4w">
                        <Button
                            type="submit"
                            title="Valider"
                            htmlType="submit"
                            disabled={!$isSubmitActive}
                            trackerName="reset-password.form.submit">
                            Valider
                        </Button>
                    </div>
                </form>
            {/if}
        </div>
    </div>
</div>
