<script>
    import { createEventDispatcher } from "svelte";
    import { user as userStore } from "../../../../store/user.store";
    import Button from "../../../../dsfr/Button.svelte";
    import { capitalizeFirstLetter } from "../../../../helpers/textHelper";
    import { action, data, modal } from "../../../../store/modal.store";
    import adminService from "../../admin.service";
    import RemoveUserModal from "./RemoveUserModal.svelte";

    export let users;
    let selectedUserId;

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
                            {user.active ? " Oui" : "Non"}
                        </td>
                        {#if user.resetToken}
                            <td>
                                <a
                                    href="/auth/reset-password/{user.resetToken}?active=true"
                                    class="fr-link"
                                    target="_blank">
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
                                disabled={user.email == $userStore.email}
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
        height: 60vh;
        overflow: auto;
    }
</style>
