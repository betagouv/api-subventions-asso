<script>
    import { onMount } from "svelte";

    import { EstablishmentsController } from "./Establishments.controller";
    import EstablishmentCard from "./EstablishmentCard.svelte";
    import DataNotFound from "$lib/components/DataNotFound.svelte";

    import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
    import SearchBar from "$lib/components/SearchBar/SearchBar.svelte";

    let element;

    const ctrl = new EstablishmentsController();
    const { asso, estabs, filteredEstabs } = ctrl;

    onMount(async () => {
        await waitElementIsVisible(element);
    });
</script>

<div bind:this={element}>
    {#if $estabs.length}
        <h2>{$estabs.length} établissements rattachés à cette association</h2>
        <div class="fr-grid-row fr-mb-8v">
            <div class="fr-col-4">
                <SearchBar
                    on:submit={e => ctrl.onFilter(e.detail)}
                    on:reset={() => ctrl.resetFilter()}
                    large={false}
                    placeholder="Rechercher un code postal, un SIRET"
                    disableIfEmpty={false} />
            </div>
        </div>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $filteredEstabs as establishment}
                <EstablishmentCard name={$asso.denomination_rna || $asso.denomination_siren} {establishment} />
            {/each}
        </div>
    {:else}
        <DataNotFound content="Nous sommes désolés, nous n'avons trouvé aucun établissement lié à cette association" />
    {/if}
</div>
