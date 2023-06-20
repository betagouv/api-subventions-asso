<script>
    import adminService from "../admin.service.js";
    import userService from "../../../resources/users/user.service.js";

    import Widget from "../../../components/Widget.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import ActionGroup from "../../../components/ActionGroup.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import Alert from "../../../dsfr/Alert.svelte";
    import Input from "../../../dsfr/Input.svelte";
    import { buildCsv, downloadCsv } from "../../../helpers/csvHelper";
    import { PAGE_ADMIN_USERS_ACCOUNT_NAME } from "../admin.constant.js";
    import TableUsers from "./composents/TableUsers.svelte";
    import SearchUsers from "./composents/SearchUsers.svelte";

    let users,
        domains = [];
    let newDomain,
        domainError = undefined;

    const addDomain = async () => {
        try {
            await adminService.addDomain(newDomain);
            domainError = false;
        } catch (e) {
            domainError = true;
        }
    };

    const removeUser = event => {
        const id = event.detail;
        const index = users.findIndex(user => user._id === id);
        users.splice(index, 1);
        // force child update by affecting a new array
        users = [...users];
    };

    const downloadUsersCsv = () => {
        const csvRows = users.map(user => [
            user.email,
            user.roles.join(" - "),
            !user.active ? "Compte à activer" : userService.isUserActif(user) ? "Oui" : "Inactif",
            new Date(user.signupAt).toLocaleDateString(),
            user.resetToken ? `/auth/reset-password/${user.resetToken}?active=true` : "",
            user.resetTokenDate ? new Date(user.resetTokenDate).toLocaleString() : "",
            user.stats.searchCount,
            new Date(user.stats.lastSearchDate).toLocaleString(),
        ]);

        const csvHeader = [
            "Email",
            "Roles",
            "Actif",
            "Date d'inscription",
            "Lien d'activation",
            "Date du token de reset",
            "Nombres de recherches",
            "Date dernière recherche",
        ];

        const csvString = buildCsv(csvHeader, csvRows);

        downloadCsv(csvString, `users-${new Date().toLocaleDateString()}`);
    };

    const usersPromise = adminService.getUsers();
    const domainsPromise = adminService.getUserDomaines();
    const promises = Promise.all([usersPromise, domainsPromise]).then(results => {
        users = results[0].reverse();
        domains = results[1];
    });
</script>

{#await promises}
    <Spinner description="Chargement des utilisateurs en cours ..." />
{:then _promises}
    <h2 class="fr-h2 fr-mb-6w">{PAGE_ADMIN_USERS_ACCOUNT_NAME}</h2>
    <div class="fr-grid-row fr-mb-6w">
        <div class="fr-col-md-12">
            {#if domainError === false}
                <Alert title="Domaine ajouté!" type="success" />
            {:else if domainError === true}
                <Alert title="L'ajout du nom de domaine a échoué" />
            {/if}
            <div class="fr-mb-2w">
                <ActionGroup>
                    <svelte:fragment slot="content">
                        <Input bind:value={newDomain} label="Ajouter un nom de domaine" />
                    </svelte:fragment>
                    <svelte:fragment slot="action">
                        <Button on:click={addDomain}>Ajouter</Button>
                    </svelte:fragment>
                </ActionGroup>
            </div>
        </div>
        <div class="fr-col-md-12">
            <Widget title="Noms de domaines :">
                <ul class="admin-domain-ul">
                    {#each domains as domain}
                        <li>
                            <a href="#{domain.name}">
                                {domain.name.replace("@", "")}
                                {domain.users.length} utilisateurs
                            </a>
                        </li>
                    {/each}
                </ul>
            </Widget>
        </div>
    </div>
    <div class="fr-grid-row fr-mb-6w">
        <div class="fr-col-md-12">
            <Widget title="Liste des utilisateurs :">
                <div class="fr-grid-row fr-pb-7w">
                    <div class="fr-col fr-col-md-6">
                        <div class="fr-grid-row fr-grid-row--left">
                            <SearchUsers bind:users />
                        </div>
                    </div>
                    <div class="fr-col fr-col-md-6">
                        <div class="fr-grid-row fr-grid-row--right">
                            <Button on:click={downloadUsersCsv}>Télécharger la liste en CSV</Button>
                        </div>
                    </div>
                </div>
                <TableUsers {users} on:userDeleted={e => removeUser(e)} />
            </Widget>
        </div>
    </div>
{:catch error}
    <ErrorAlert message={error.message} />
{/await}
