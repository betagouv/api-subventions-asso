<script>
    import admin from "../admin.service.js";
    import { user as userStore } from "../../../store/user.store";

    import Spinner from "../../../components/Spinner.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import StatsUsers from "./composents/StatsUsers.svelte";
    import SearchUsers from "./composents/SearchUsers.svelte";
    import TableUsers from "./composents/TableUsers.svelte";
    import Button from "../../../dsfr/Button.svelte";
    import { buildCsv, downloadCsv } from "../../../helpers/csvHelper";

    let users = [];
    const currentAdminUser = $userStore;

    if (!currentAdminUser || !currentAdminUser.roles || !currentAdminUser.roles.includes("admin")) {
        document.location.href = "/";
    }

    let promise = new Promise(() => null);

    const loadUsers = () => {
        promise = admin.getUsers().then(_users => (users = _users)); // Not use then in template because var can be declared for bind;
    };

    const removeUser = event => {
        const id = event.detail;
        const index = users.findIndex(user => user._id === id);
        users.splice(index, 1);
        // force child update by affecting a new array
        users = [...users];
    };

    loadUsers();

    const downloadUsersCsv = () => {
        const csvRows = users.map(user => [
            user.email,
            user.roles.join(" - "),
            user.active ? "Oui" : "Non",
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

{#await promise}
    <Spinner description="Chargement des utilisateurs en cours ..." />
{:then}
    <div>
        <div class="fr-grid-row fr-grid-row--center admin_list-users_stats admin_list-widget">
            <StatsUsers {users} />
        </div>

        <div class="fr-grid-row admin_list-widget">
            <!--TODO replace by Widget component-->
            <div class="fr-col fr-col-md-6">
                <h2>Liste des utilisateurs :</h2>
            </div>
            <div class="fr-col fr-col-md-12 admin_list-table-head">
                <div class="fr-grid-row">
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
            </div>

            <!-- TODO: ne pas recharger les utilisateurs mais plutôt mettre à jour l'objet users pour éviter une requête -->
            <TableUsers {users} on:userDeleted={e => removeUser(e)} />
        </div>
    </div>
{:catch error}
    <ErrorAlert message={error.message} />
{/await}

<style>
    .admin_list-users_stats {
        margin-top: 20px;
        margin-bottom: 50px;
    }
    .admin_list-table-head {
        margin-bottom: 50px;
        margin-top: 50px;
    }

    .admin_list-widget {
        border: 1px solid #e5e5e5;
        padding: 20px;
    }
</style>
