<script lang="ts">
    import EstablishmentCard from "./EstablishmentCard.svelte";
    import { EstablishmentsController } from "./Establishments/Establishments.controller";
    import DataNotFound from "$lib/components/DataNotFound.svelte";

    import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";
    import Pagination from "$lib/dsfr/Pagination.svelte";
    import Store from "$lib/core/Store";

    const controller = new EstablishmentsController(currentAssoSimplifiedEtabs);

    const { visibleEstablishments, totalPage, currentPage } = controller;
</script>

<div>
    {#if $visibleEstablishments.length && $currentAssociation}
        <h2>Les établissements rattachés à cette association</h2>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $visibleEstablishments as establishment}
                {#key establishment}
                    <!--Force re render svelte component-->
                    <EstablishmentCard
                        name={$currentAssociation.denomination_rna || $currentAssociation.denomination_siren}
                        {establishment} />
                {/key}
            {/each}
        </div>
        <div>
            <Pagination {totalPage} {currentPage} />
        </div>
    {:else}
        <DataNotFound content="Nous sommes désolés, nous n'avons trouvé aucun établissement lié à cette association" />
    {/if}
</div>
