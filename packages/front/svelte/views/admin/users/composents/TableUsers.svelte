<script>
    import { createEventDispatcher } from "svelte";

    import { action, data, modal } from "../../../../store/modal.store";
    import adminService from "../../admin.service";

    import Button from "../../../../dsfr/Button.svelte";
    import RemoveUserModal from "./RemoveUserModal.svelte";
    import { capitalizeFirstLetter } from "@helpers/stringHelper";
    import userService from "@resources/users/user.service";
    import authService from "@resources/auth/auth.service";

    export let users;
    let selectedUserId;

    const currentUser = authService.getCurrentUser();

    const dispatch = createEventDispatcher();

    const displayModal = user => {
        selectedUserId = user._id;
        data.update(() => user.email);
        modal.update(() => RemoveUserModal);
        action.update(() => deleteUser);
    };

    const deleteUser = async () => {
        try {
            await adminService.deleteUser(selectedUserId);
            dispatch("userDeleted", selectedUserId);
        } catch (e) {
            console.log("Something went wrong! Could not delete user...");
        }
        selectedUserId = undefined;
    };
</script>

<div class="fr-col fr-col-lg-12 fr-grid-row fr-grid-row--center">
    <div class="fr-table">
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Actif</th>
                    <th>Nombre de recherches</th>
                    <th>Date dernière recherche</th>
                    <th>Date d'inscription</th>
                    <th>Lien d'activation</th>
                    <th>Date du token de reset</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user}
                    <tr>
                        <td>
                            {user.email}
                        </td>
                        <td>
                            {user.roles.map(r => capitalizeFirstLetter(r)).join(", ")}
                        </td>
                        <td>
                            {#if !user.active}
                                Compte à activer
                            {:else if userService.isUserActif(user)}
                                Oui
                            {:else}
                                <div class="tooltip-wrapper">
                                    <span class="tooltip">
                                        L’utilisateur n’a pas effectué de recherche depuis plus de 7 jours
                                    </span>
                                    Inactif
                                    <span class="fr-icon-question-line tooltip-icon fr-icon--sm" aria-hidden="true" />
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
                                    class="fr-link"
                                    target="_blank"
                                    rel="noreferrer">
                                    Copiez-moi !
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
                                disabled={user.email == currentUser.email}
                                type="tertiary"
                                icon="delete-fill"
                                ariaControls="fr-modal"
                                on:click={() => displayModal(user)} />
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .fr-table {
        overflow: auto;
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
