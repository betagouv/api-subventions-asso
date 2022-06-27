<script>
    import { onMount } from "svelte";
    import { getAddress } from "../association.helper";
    import associationService from "../association.service.js";

    import Card from "../../../dsfr/Card.svelte";
    import Spinner from "../../../components/Spinner.svelte";

    import { valueOrHyphen } from "../../../helpers/dataHelper";
    import { waitElementIsVisible } from "../../../helpers/visibilityHelper";

    export let associationIdentifier;

    let element;
    let promise = new Promise(() => null);

    onMount(async () => {
        await waitElementIsVisible(element);
        promise = associationService.getEtablissements(associationIdentifier);
    })
</script>

<div bind:this={element}>
    {#await promise}
        <Spinner description="Chargement des établissements en cours ..."/>
    {:then etablissements}
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each etablissements as etablissement }
                <Card title={etablissement.siret} url="/etablissement/{etablissement.siret}" target="_blank">
                    {#if etablissement.siege }
                        <p>Siège de l'association</p>
                    {:else if !etablissement.ouvert }
                        <p>-- Établissement fermé --</p>
                    {:else }
                        <p>Établissement secondaire</p>
                    {/if}
                    <p>{valueOrHyphen(getAddress(etablissement.adresse))}</p>
                </Card>
            {/each}
        </div>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</div>

<style>
</style>
