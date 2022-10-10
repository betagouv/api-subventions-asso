<script>
    import { beforeUpdate } from "svelte";
    import { data } from "../../../store/modal.store";
    import { numberToEuro } from "../../../helpers/dataHelper";

    let title = "Détails des informations pour la demande de subvention";

    beforeUpdate(() => {
        if ($data.subvention) {
            title = `Détails des informations pour la demande ${$data.subvention.status.toLowerCase()} auprès du service ${
                $data.subvention.service_instructeur
            }` + $data.subvention.montants.demande ? ` pour un montant demandée de ${numberToEuro($data.subvention.montants.demande)}` : '';
        }
    });
</script>

{#if $data.subvention}
    {#each $data.subvention.actions_proposee as action}
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
