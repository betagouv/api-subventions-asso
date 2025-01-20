<script lang="ts">
    import EstablishmentCard from "../EstablishmentCard.svelte";
    import { EstablishmentsController } from "./Establishments.controller";
    import DataNotFound from "$lib/components/DataNotFound.svelte";

    import Pagination from "$lib/dsfr/Pagination.svelte";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    const controller = new EstablishmentsController();

    const { associationStore, establishmentsStore, visibleEstablishments, totalPages, currentPage } = controller;
</script>

<div>
    {#if $establishmentsStore.length && $associationStore}
        <h2>{controller.title}</h2>
        <div class="fr-grid-row fr-mb-8v">
            <div class="fr-col-5">
                <SearchBar
                    on:submit={e => controller.onFilter(e.detail)}
                    on:reset={() => controller.resetFilter()}
                    large={false}
                    placeholder="Rechercher un code postal ou un NIC"
                    disableIfEmpty={false} />
            </div>
        </div>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $visibleEstablishments as establishment}
                {#key establishment}
                    <!--Force re render svelte component-->
                    <EstablishmentCard
                        name={$associationStore.denomination_rna || $associationStore.denomination_siren}
                        {establishment} />
                {/key}
            {/each}
        </div>
        {#if $totalPages > 1}
            <div class="fr-grid-row">
                <div class="fr-mx-auto fr-mt-3w">
                    {#key $totalPages}
                        <Pagination totalPages={$totalPages} {currentPage} />
                    {/key}
                </div>
            </div>
        {/if}
    {:else}
        <DataNotFound content="Nous sommes désolés, nous n'avons trouvé aucun établissement lié à cette association" />
    {/if}
</div>
