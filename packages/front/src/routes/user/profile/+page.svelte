<script>
    import { onMount } from "svelte";
    import { ProfileController } from "./Profile.controller";
    import DeleteUser from "./components/DeleteUser.svelte";
    import SignupModule from "./components/SignupModule.svelte";
    // import ResetPwdModule from "./components/ResetPwdModule/ResetPwdModule.svelte";
    import StructureFormStep from "$lib/components/StructureFormStep/StructureFormStep.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Select from "$lib/dsfr/Select.svelte";

    let saveAlertElement;
    let modalCtrlButton;

    const controller = new ProfileController();
    const { deleteError, user, saveStatus, isSubmitBlocked } = controller;

    onMount(() => controller.onMount(saveAlertElement, modalCtrlButton));
    controller.init();
</script>

<div class="fr-grid-row">
    <div class=" fr-col-offset-2 fr-col-8">
        <h1 class="fr-h2">Bienvenue sur votre compte</h1>
        <div class="fr-grid-row">
            <form on:submit|preventDefault={() => controller.onSubmit($user)} class="bordered-frame">
                <h2 class="fr-h5">Vos informations de profil</h2>
                <button
                    type="button"
                    data-fr-opened="false"
                    hidden
                    aria-controls="fr-modal"
                    bind:this={modalCtrlButton} />
                <div bind:this={saveAlertElement}>
                    {#if $saveStatus === "changed"}
                        <Alert type="warning" small={true}>
                            Des champs ont été modifiés, n’oubliez pas d’enregistrer les modifications avant de quitter
                            cette page.
                        </Alert>
                    {:else if $saveStatus === "saved"}
                        <Alert type="success" small={true}>Vos modifications ont bien été enregistrées.</Alert>
                    {:else if $saveStatus === "error"}
                        <Alert type="error" small={true}>
                            Une erreur est survenue lors de l'enregistrement de vos données.
                        </Alert>
                    {/if}
                </div>
                <fieldset class="fr-fieldset fr-mt-6w">
                    <SignupModule
                        bind:user={$user}
                        on:change={() => controller.onChange()}
                        readOnly={$user.agentConnectId} />
                    <!--<div class="fr-fieldset__element fr-mt-4v">
              <ResetPwdModule email={$user.email} />
              TODO le user est pas réactif dans le composant. Il faudrait passer un store mais ça va être
                  pénible de faire ça depuis un prop : stocker l'utilisateur dans un store global ?
                  Peut-être pas nécessaire
                  De plus il faudrait aussi déconnecter l'utilisateur parce que son token va être invalidé
          </div>-->
                </fieldset>

                <div class="separator fr-mb-6w fr-mt-4w" />

                <fieldset class="fr-fieldset">
                    <div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--inline-grow">
                        <Select
                            options={controller.agentTypeOptions}
                            label="Vous êtes : "
                            bind:selected={$user.agentType}
                            required={true}
                            on:change={() => controller.onChange()} />
                    </div>
                </fieldset>
                <StructureFormStep
                    bind:values={$user}
                    context={{ agentType: $user.agentType }}
                    on:change={() => controller.onChange()}
                    on:valid={() => controller.updateValidation(true)}
                    on:error={() => controller.updateValidation(false)} />
                <Button trakerName="profile.save" disabled={$isSubmitBlocked} htmlType="submit">
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
