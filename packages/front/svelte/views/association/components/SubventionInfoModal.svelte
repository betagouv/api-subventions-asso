<script>
    import { beforeUpdate } from "svelte";

    import Modal from "../../../dsfr/Modal.svelte";
    import { numberToEuro } from "../../../helpers/dataHelper";

    export let subvention;
    export let id;

    let title = "Détails des informations pour la demande de subvention";

    beforeUpdate(() => {
        if (subvention) {
            title = `Détails des informations pour la demande ${subvention.status.toLowerCase()} auprès du service ${
                subvention.service_instructeur
            } pour un montant demandée de ${numberToEuro(subvention.montants.demande)}`;
        }
    });
</script>

<Modal {title} modalId={id}>
    <svelte:fragment slot="content">
        {#if subvention}
            {#each subvention.actions_proposee as action}
                <div class="action">
                    <h4>{action.intitule}</h4>
                    {#each action.objectifs.split("\n") as line}
                        {#if line.length}
                            <p>{line}</p>
                        {/if}
                    {/each}
                </div>
            {/each}
        {/if}
    </svelte:fragment>
</Modal>

<style>
    .action {
        margin-bottom: 40px;
        border-bottom: 1px black solid;
        padding-bottom: 25px;
    }

    .action:last-child {
        margin-bottom: 0px;
        padding-bottom: 0px;
        border-bottom: 0px;
    }
</style>
