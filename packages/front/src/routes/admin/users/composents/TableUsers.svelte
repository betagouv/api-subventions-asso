<script>
    import TableUsersController from "./TableUsers.controller";

    import Button from "$lib/dsfr/Button.svelte";
    import userService from "$lib/resources/users/user.service";
    import Table from "$lib/dsfr/Table.svelte";

    export let usersStore;

    const ctrl = new TableUsersController(usersStore);
    const { users } = ctrl;
</script>

<div class="fr-col fr-col-lg-12 fr-grid-row fr-grid-row--center">
    <table>
        <thead>
            <th>Email</th>
            <th>Roles</th>
            <th>Actif</th>
            <th>Nombre de recherches</th>
            <th>Date dernière recherche</th>
            <th>Date d'inscription</th>
            <th>Lien d'activation</th>
            <th>Date du token de reset</th>
            <th>Action</th>
        </thead>
        <tbody>
            {#each $users as user}
                <tr>
                    <td>
                        {user.email}
                    </td>
                    <td>
                        {ctrl.prettyUserRoles(user)}
                    </td>
                    <td>
                        {#if !user.active}
                            Compte à activer
                        {:else if userService.isUserActif(user)}
                            Oui
                        {:else}
                            <div class="tooltip-wrapper flex">
                                <span class="tooltip">
                                    L’utilisateur n’a pas effectué de recherche depuis plus de 7 jours
                                </span>
                                Inactif
                                <span
                                    class="fr-icon-question-line tooltip-icon fr-icon--sm fr-ml-1v"
                                    aria-hidden="true" />
                            </div>
                        {/if}
                    </td>
                    <td>
                        {user.stats.searchCount}
                    </td>
                    <td>
                        {user.stats.lastSearchDate ? new Date(user.stats.lastSearchDate).toLocaleString() : "-"}
                    </td>
                    <td>
                        {new Date(user.signupAt).toLocaleDateString()}
                    </td>
                    {#if user.resetToken}
                        <td>
                            <a
                                href="/auth/reset-password/{user.resetToken}?active=true"
                                title="Lien d'activation - nouvelle fenêtre">
                                Lien d'activation
                            </a>
                        </td>
                        <td>
                            {new Date(user.resetTokenDate).toLocaleString()}
                        </td>
                    {:else}
                        <td colspan="2" />
                    {/if}
                    <td>
                        <Button
                            disabled={ctrl.isUserDisabled(user)}
                            type="tertiary"
                            icon="delete-fill"
                            trackingDisable="true"
                            ariaControls="fr-modal"
                            on:click={() => ctrl.displayModal(user)} />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    table,
    td,
    th {
        border: 1px solid black;
        border-collapse: collapse;
        background: var(--background-default-grey);
    }

    th,
    td {
        padding: 0.5rem;
    }

    /* This is a quick fix and if needed a Tooltip component should be made */
    .tooltip-wrapper {
        position: relative;
    }

    .tooltip-wrapper .tooltip {
        top: -40px;
        left: -165px;
    }

    .tooltip {
        display: none;
        position: absolute;
        color: #fff;
        background-color: #555;
        padding: 5px;
        border-radius: 6px;
        white-space: nowrap;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .tooltip-wrapper:hover > span.tooltip {
        display: block;
    }

    .tooltip-icon {
        color: var(--text-active-blue-france);
    }
</style>
