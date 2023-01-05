<script>
    import adminService from "../admin.service.js";
    import userService from "../../../resources/users/users.service.js";

    import Widget from "../../../components/Widget.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import SearchUsers from "./composents/SearchUsers.svelte";
    import TableUsers from "./composents/TableUsers.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import { buildCsv, downloadCsv } from "../../../helpers/csvHelper";
    import { PAGE_ADMIN_USERS_ACCOUNT_NAME } from "../admin.constant.js";

    let users,
        domains = [];

    // const loadUsers = () => {
    //     usersPromise = adminService.getUsers().then(_users => (users = _users)); // Template bind cannot come from await block (c.f svelt(invalid-binding))
    // };

    const usersPromise = adminService.getUsers();
    const domainsPromise = adminService.getUserDomaines();
    const promises = Promise.all([usersPromise, domainsPromise]).then(results => {
        console.log(results);
        users = results[0];
        domains = results[1];
    });

    const removeUser = event => {
        const id = event.detail;
        const index = users.findIndex(user => user._id === id);
        users.splice(index, 1);
        // force child update by affecting a new array
        users = [...users];
    };

    // loadUsers();

    const downloadUsersCsv = () => {
        const csvRows = users.map(user => [
            user.email,
            user.roles.join(" - "),
            !user.active ? "Compte à activer" : userService.isUserActif(user) ? "Oui" : "Inactif",
            new Date(user.signupAt).toLocaleDateString(),
            user.resetToken ? `/auth/reset-password/${user.resetToken}?active=true` : "",
            user.resetTokenDate ? new Date(user.resetTokenDate).toLocaleString() : "",
            user.stats.searchCount,
            new Date(user.stats.lastSearchDate).toLocaleString()
        ]);

        const csvHeader = [
            "Email",
            "Roles",
            "Actif",
            "Date d'inscription",
            "Lien d'activation",
            "Date du token de reset",
            "Nombres de recherches",
            "Date dernière recherche"
        ];

        const csvString = buildCsv(csvHeader, csvRows);

        downloadCsv(csvString, `users-${new Date().toLocaleDateString()}`);
    };
</script>

{#await promises}
    <Spinner description="Chargement des utilisateurs en cours ..." />
{:then _promises}
    <h2 class="fr-h2 fr-mb-6w">{PAGE_ADMIN_USERS_ACCOUNT_NAME}</h2>
    <div class="fr-grid-row fr-mb-6w">
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
                            <Button on:click={downloadUsersCsv}>Téléchager la liste en CSV</Button>
                        </div>
                    </div>
                </div>
                <!-- TODO: ne pas recharger les utilisateurs mais plutôt mettre à jour l'objet users pour éviter une requête -->
                <TableUsers {users} on:userDeleted={e => removeUser(e)} />
            </Widget>
        </div>
    </div>
{:catch error}
    <ErrorAlert message={error.message} />
{/await}
