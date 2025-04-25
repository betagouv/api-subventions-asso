<script>
    import { PAGE_ADMIN_USERS_ACCOUNT_NAME } from "../../admin.constant.js";
    import TableUsers from "../composents/TableUsers.svelte";
    import SearchUsers from "../composents/SearchUsers.svelte";

    import AdminUserAccountListController from "./AdminUserAccountList.controller";
    import Widget from "$lib/components/Widget.svelte";
    import Spinner from "$lib/components/Spinner.svelte";
    import ErrorAlert from "$lib/components/ErrorAlert.svelte";
    import ActionGroup from "$lib/components/ActionGroup.svelte";
    import Button from "$lib/dsfr/Button.svelte";
    import Alert from "$lib/dsfr/Alert.svelte";
    import Input from "$lib/dsfr/Input.svelte";

    const ctrl = new AdminUserAccountListController();
    const { users, domainError, newDomain } = ctrl;
</script>

{#await ctrl.promises}
    <Spinner description="Chargement des utilisateurs en cours ..." />
{:then}
    <h2 class="fr-h2 fr-mb-6w">{PAGE_ADMIN_USERS_ACCOUNT_NAME}</h2>
    <div class="fr-grid-row fr-mb-6w">
        <div class="fr-col-md-12">
            {#if $domainError === false}
                <Alert title="Domaine ajouté !" type="success" />
            {:else if $domainError === true}
                <Alert title="L'ajout du nom de domaine a échoué" />
            {/if}
            <div class="fr-mb-2w">
                <ActionGroup>
                    <svelte:fragment slot="content">
                        <Input bind:value={$newDomain} label="Ajouter un nom de domaine" />
                    </svelte:fragment>
                    <svelte:fragment slot="action">
                        <Button on:click={() => ctrl.addDomain()}>Ajouter</Button>
                    </svelte:fragment>
                </ActionGroup>
            </div>
        </div>
    </div>
    <div class="fr-grid-row fr-mb-6w">
        <div class="fr-col-md-12">
            <Widget title="Liste des utilisateurs :">
                <div class="fr-grid-row fr-pb-7w">
                    <div class="fr-col fr-col-md-6">
                        <div class="fr-grid-row fr-grid-row--left">
                            <SearchUsers bind:users={$users} />
                        </div>
                    </div>
                    <div class="fr-col fr-col-md-6">
                        <div class="fr-grid-row fr-grid-row--right">
                            <Button on:click={() => ctrl.downloadUsersCsv()}>Télécharger la liste en CSV</Button>
                        </div>
                    </div>
                </div>
                <TableUsers usersStore={users} />
            </Widget>
        </div>
    </div>
{:catch error}
    <ErrorAlert message={error.message} />
{/await}
