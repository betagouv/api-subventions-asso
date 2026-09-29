<script lang="ts">
    import { ResetPwdController } from "./ResetPwd.controller";
    import PasswordFormatAlert from "$lib/components/DefinePassword/PasswordFormatAlert.svelte";
    import PasswordErrorAlert from "$lib/components/DefinePassword/PasswordErrorAlert.svelte";
    import DefinePassword from "$lib/components/DefinePassword/DefinePassword.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import type { PageProps } from "./$types";

    let { params }: PageProps = $props();
    const token = $derived(params.token);

    const ctrl = $derived(new ResetPwdController(token));

    $effect(() => {
        ctrl.init();
    });

    const promise = $derived(ctrl.promise);
    const values = $derived(ctrl.values);
    const isSubmitActive = $derived(ctrl.isSubmitActive);
    const validationTokenStore = $derived(ctrl.validationTokenStore);
    const title = $derived(ctrl.title);
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

                <form
                    action="#"
                    method="GET"
                    onsubmit={event => {
                        event.preventDefault();
                        ctrl.onSubmit();
                    }}>
                    <DefinePassword
                        onerror={() => ctrl.disableSubmit()}
                        onvalid={() => ctrl.enableSubmit()}
                        bind:values={$values} />
                    <div class="fr-input-group fr-my-4w">
                        <Button
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
