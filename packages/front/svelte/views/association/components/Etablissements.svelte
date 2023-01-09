<script>
    import { onMount } from "svelte";
    import { getAddress } from "../association.helper";
    import associationService from "../association.service.js";

    import Card from "../../../dsfr/Card.svelte";
    import Spinner from "../../../components/Spinner.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import DataNotFound from "../../../components/DataNotFound.svelte";

    import etablissementService from "../../etablissement/etablissement.service";
    import { valueOrHyphen } from "../../../helpers/dataHelper";
    import { waitElementIsVisible } from "../../../helpers/visibilityHelper";

    export let associationIdentifier;
    export let association;

    let element;
    let promise = new Promise(() => null);

    onMount(async () => {
        await waitElementIsVisible(element);
        promise = associationService.getEtablissements(associationIdentifier);
    });
</script>

<div bind:this={element}>
    {#await promise}
        <Spinner description="Chargement des établissements en cours ..." />
    {:then etablissements}
        {#if etablissements.length}
            <h3>Les établissements rattachés à cette association</h3>
            <div class="fr-grid-row fr-grid-row--gutters">
                {#each etablissements as etablissement}
                    <Card
                        title={association.denomination_rna || association.denomination_siren}
                        url="/etablissement/{etablissement.siret}"
                        target="_blank">
                        <p>
                            {etablissementService.getEtablissementStatus(etablissement)}
                            <br />
                            SIRET : {valueOrHyphen(etablissement.siret)}
                            <br />
                        </p>
                        <div class="flex">
                            <span class="fr-col-md-1 fr-mr-1w fr-icon-map-pin-2-line color" />
                            <span class="fr-col-md-11 fr-text--bold">
                                {valueOrHyphen(getAddress(etablissement.adresse))}
                            </span>
                        </div>
                    </Card>
                {/each}
            </div>
        {:else}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun etablissement liée à cette association" />
        {/if}
    {:catch error}
        {#if error.request && error.request.status == 404}
            <DataNotFound
                content="Nous sommes désolés, nous n'avons trouvé aucun etablissement liée à cette association" />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>

<style>
    .color {
        color: var(--blue-france-sun-113-625);
    }
</style>
