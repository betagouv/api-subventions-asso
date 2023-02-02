<script>
    import Alert from "../../../dsfr/Alert.svelte";
    import LoginController from "./Login.controller";

    let form;
    export let query;
    const controller = new LoginController(query);

    const { error, showSuccessMessage, successMessage } = controller;
    $: controller.formElt = form;
</script>

<div class="fr-container fr-mb-8w">
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div class="fr-col fr-col-lg-8">
            <h1>Connexion</h1>
            <Alert type="info" title="Inscription">
                <a class="fr-link" href="/auth/signup">
                    Rendez-vous sur notre formulaire d'inscription (en cliquant sur ce lien)
                </a>
            </Alert>
            {#if $error != null}
                <Alert title="Attention">
                    {$error}
                </Alert>
            {/if}
            {#if showSuccessMessage}
                <Alert type="success">
                    {successMessage}
                </Alert>
            {/if}
            <form bind:this={form} on:submit={e => controller.submit(e)}>
                <fieldset class="fr-fieldset fr-my-4w">
                    <legend class="fr-fieldset__legend" id="text-legend">Vos identifiants</legend>
                    <label class="fr-label fr-pl-1w" for="text-input-text">Email :</label>
                    <input class="fr-input fr-ml-1w" type="email" name="email" required="true" />
                    <label class="fr-label fr-mt-2w fr-ml-1w" for="text-input-text">Mot de passe :</label>
                    <input class="fr-input fr-ml-1w" type="password" name="password" required="true" />
                </fieldset>
                <div class="fr-input-group fr-my-4w">
                    <button type="submit" class="fr-btn" title="Connection">Valider</button>
                    <a class="fr-link" href="/auth/forget-password">Mot de passe oublié</a>
                </div>
            </form>
        </div>
    </div>
</div>
