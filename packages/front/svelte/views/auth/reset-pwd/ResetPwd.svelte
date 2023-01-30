<script>
    import Alert from "@dsfr/Alert.svelte";
    import Input from "@dsfr/Input.svelte";
    import Button from "@dsfr/Button.svelte";
    import { ResetPwdController } from "./ResetPwd.controller";
    import Spinner from "@components/Spinner.svelte";

    export let token;

    const ctrl = new ResetPwdController(token);
    const { promise, password } = ctrl;
    $: isPasswordOk = ctrl.checkPassword($password);
</script>

<div class="fr-container fr-mb-8w">
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col fr-col-lg-8">
            <h1>{ctrl.title}</h1>

            <Alert title="Format du mot de passe" type="info">
                <ul>
                    <li>Doit contenir au moins un chiffre [0-9]</li>
                    <li>Doit contenir au moins un caractère minuscule [a-z]</li>
                    <li>Doit contenir au moins un caractère majuscule [A-Z]</li>
                    <!-- eslint-disable-next-line -->
                    <li>Doit contenir au moins un caractère spécial {`[ *.!@#$%^&(){}[]:;<>,.?/~_+-=|\\]`}</li>
                    <li>Doit contenir au moins 8 caractères, mais pas plus de 32</li>
                </ul>
            </Alert>
            {#await $promise}
                <div class="fr-mb-5w fr-mt-n4w">
                    <Spinner />
                </div>
            {:catch error}
                <Alert title="Attention" type="warning">
                    {@html ctrl.getErrorMessage(error)}
                </Alert>
            {/await}
            <form action="#" method="GET" on:submit|preventDefault={() => ctrl.onSubmit()}>
                <fieldset class="fr-fieldset fr-my-4w">
                    <div class="fr-input-group">
                        <Input
                            label="Mot de passe :"
                            id="password"
                            bind:value={$password}
                            required={true}
                            type="password" />
                    </div>
                </fieldset>
                <div class="fr-input-group fr-my-4w">
                    <Button type="submit" title="Valider" htmlType="submit" disabled={!isPasswordOk}>Valider</Button>
                </div>
            </form>
        </div>
    </div>
</div>
