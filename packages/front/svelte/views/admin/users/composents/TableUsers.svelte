<script>
    import { createEventDispatcher } from "svelte";
import TableCell from "../../../../components/TableCell.svelte";
import TableHead from "../../../../components/TableHead.svelte";

    import Button from "../../../../dsfr/Button.svelte";
    import Modal from "../../../../dsfr/Modal.svelte";
import Table from "../../../../dsfr/Table.svelte";
import { capitalizeFirstLetter } from "../../../../helpers/textHelper";
    import adminService from "../../admin.service";

    export let users;
    const dispatch = createEventDispatcher();
    const deleteUsersClicked = async user => {
        await adminService.deleteUser(user._id);
        dispatch("userDeleted");
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
                            <td colspan="2"></td>
                        {/if}
                        <td>
                            <Button type="tertiary" icon="delete-fill" ariaControls="fr-modal-{user._id}" />
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

{#each users as user}
    <Modal modalId={user._id} title="Souhaitez-vous vraiment supprimer cet utilisateur ?">
        <svelte:fragment slot="content">
            <p>Cette action sera définitive, il sera impossible de revenir en arrière.</p>
        </svelte:fragment>
        <svelte:fragment slot="footer">
            <ul
                class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                <li>
                    <Button type="primary" ariaControls="fr-modal-{user._id}">Non</Button>
                </li>
                <li>
                    <Button
                        type="secondary"
                        on:click={deleteUsersClicked.bind(null, user)}
                        ariaControls="fr-modal-{user._id}">
                        Oui
                    </Button>
                </li>
            </ul>
        </svelte:fragment>
    </Modal>
{/each}

<style>
    .fr-table {
        height: 60vh;
        overflow: auto;
    }
</style>
