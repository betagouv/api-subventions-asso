<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Tooltip from "$lib/dsfr/Tooltip.svelte";
    import ButtonSort from "$lib/dsfr/ButtonSort.svelte";

    export let id: string;
    export let headers: { name: string; tooltip?: string }[];

    const dispatch = createEventDispatcher<{ sort: number }>();

    let sortDirection: "none" | "ascending" | "descending" = "none";

    function handleSort(index) {
        if (sortDirection === "none") sortDirection = "descending";
        else if (sortDirection === "descending") sortDirection = "ascending";
        else sortDirection = "descending";
        dispatch("sort", index);
    }
</script>

{#each headers as header, index (index)}
    <th aria-sort={sortDirection}>
        <div class="fr-cell--sort">
            <span class="fr-cell__title">{header.name}</span>
            {#if header.tooltip}
                <span aria-describedby="header-tooltip-{index}" class="fr-icon-question-line high-blue-france fr-ml-2v">
                </span>
                <Tooltip id="header-tooltip-{index}"><p>{header.tooltip}</p></Tooltip>
            {/if}
            <ButtonSort on:click={() => handleSort(index)} id="table-{id}-{index}-sort-asc-desc" {sortDirection} />
        </div>
    </th>
{/each}
