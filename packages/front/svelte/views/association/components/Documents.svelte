<script>
    import { onMount } from "svelte";
    import associationService from "../association.service.js";
    import { waitElementIsVisible } from "../../../helpers/visibilityHelper";

    import Spinner from "../../../components/Spinner.svelte";
    import CardDocuments from "../../../components/CardDocuments.svelte";
    import ErrorAlert from "../../../components/ErrorAlert.svelte";
    import DataNotFound from "../../../components/DataNotFound.svelte";
    import Alert from "../../../dsfr/Alert.svelte";
    import { getSiegeSiret } from "../association.helper.js";

    export let association;

    let element;
    let promise = new Promise(() => null);

    const getDateString = date => {
        if (date.getTime() === 0) return "Date de dépôt non disponible";
        return `Déposé le ${date.toLocaleDateString()}`;
    };

    onMount(async () => {
        await waitElementIsVisible(element);
        const associationDocuments = await associationService.getDocuments(association.rna || association.siren);
        promise = Promise.resolve(
            associationDocuments.filter(doc => !doc.__meta__.siret || doc.__meta__.siret == getSiegeSiret(association))
        );
    });
</script>

<div bind:this={element}>
    {#await promise}
        <Spinner description="Chargement des pièces administratives en cours ..." />
    {:then documents}
        {#if documents.length}
            <Alert type="info" title="État des fichiers">
                Certains fichiers peuvent être erronés selon la manière dont ils ont été renseignés auprès de nos
                fournisseurs de données.
            </Alert>
            <h3>Pièces administratives pour cette association</h3>
            <div class="fr-grid-row fr-grid-row--gutters">
                {#each documents as document}
                    <CardDocuments
                        title={document.label}
                        url={document.url}
                        size="6"
                        footer={getDateString(document.date)}>
                        <p>
                            {document.nom}
                        </p>

                        <p class="card-document_fournisseur">
                            Fournisseur du fichier: <b>{document.provider}</b>
                        </p>
                    </CardDocuments>
                {/each}
            </div>
        {:else}
            <DataNotFound content="Nous sommes désolés, nous n'avons trouvé aucun document sur cette association" />
        {/if}
    {:catch error}
        {#if error.request && error.request.status == 404}
            <DataNotFound content="Nous sommes désolés, nous n'avons trouvé aucun document sur cette association" />
        {:else}
            <ErrorAlert message={error.message} />
        {/if}
    {/await}
</div>

<style>
    .card-document_fournisseur {
        font-size: 0.9em;
    }
</style>
