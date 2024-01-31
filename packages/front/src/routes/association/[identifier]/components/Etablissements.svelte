<script>
    import { onMount } from "svelte";

    import EstablishmentCard from "./EstablishmentCard.svelte";
    import DataNotFound from "$lib/components/DataNotFound.svelte";

    import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
    import { currentAssociation, currentAssoSimplifiedEtabs } from "$lib/store/association.store";

    let element;

    onMount(async () => {
        await waitElementIsVisible(element);
    });
</script>

<div bind:this={element}>
    {#if $currentAssoSimplifiedEtabs.length}
        <h2>Les établissements rattachés à cette association</h2>
        <div class="fr-grid-row fr-grid-row--gutters">
            {#each $currentAssoSimplifiedEtabs as establishment}
                <EstablishmentCard
                    name={$currentAssociation.denomination_rna || $currentAssociation.denomination_siren}
                    {establishment} />
            {/each}
        </div>
    {:else}
        <DataNotFound content="Nous sommes désolés, nous n'avons trouvé aucun établissement lié à cette association" />
    {/if}
</div>
