<script>
    import { onMount } from "svelte";
    import { ProfileController } from "./Profile.controller";
    import DeleteUser from "./components/DeleteUser.svelte";
    import SignupModule from "./SignupModule.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Button from "$lib/dsfr/Button.svelte";

    let saveAlertElement;

    const controller = new ProfileController();
    const { deleteError, user, saveStatus } = controller;

    controller.init();
    onMount(() => controller.onMount(saveAlertElement));
</script>

<div class="fr-container">
    <div class="fr-grid-row">
        <div class=" fr-col-offset-2 fr-col-8">
            <h1 class="fr-h2">Bienvenue sur votre compte</h1>
            <div class="fr-grid-row">
                <form on:submit|preventDefault={() => controller.onSubmit()} class="bordered-frame">
                    <div bind:this={saveAlertElement}>
                        {#if $saveStatus === "changed"}
                            <Alert type="warning" small={true}>
                                Des champs ont été modifiés, n’oubliez pas d’enregistrer les modifications avant de
                                quitter cette page.
                            </Alert>
                        {:else if $saveStatus === "saved"}
                            <Alert type="success" small={true}>Vos modifications ont bien été enregistrées.</Alert>
                        {:else if $saveStatus === "error"}
                            <Alert type="error" small={true}>
                                Une erreur est survenue lors de l'enregistrement de vos données.
                            </Alert>
                        {/if}
                    </div>

                    <fieldset class="fr-fieldset">
                        <legend class="fr-fieldset__legend">
                            <h2 class="fr-h5">Vos informations de profil</h2>
                        </legend>
                        <SignupModule bind:user={$user} />
                    </fieldset>

                    <Button trakerName="profile.save" disabled={$saveStatus !== "changed" && $saveStatus !== "error"}>
                        Enregistrer les modifications
                    </Button>
                </form>
            </div>

            <div class="fr-grid-row fr-mt-6w">
                {#if $deleteError}
                    <Alert title="La suppression a échouée, veuillez réessayer plus tard ou nous contacter." />
                {/if}
                <DeleteUser on:delete-user={() => controller.deleteUser()} />
            </div>
        </div>
    </div>
</div>
