<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Tooltip from "$lib/dsfr/Tooltip.svelte";
    import ButtonSort from "$lib/dsfr/ButtonSort.svelte";

    export let id: string;
    export let headers: { name: string; tooltip?: string }[];

    const dispatch = createEventDispatcher<{ sort: number }>();

    let sortDirectionIndex: { index: number; sortDirection: "none" | "ascending" | "descending" }[] = headers.map(
        (_header, index) => ({ index, sortDirection: "none" }),
    );

    function handleSort(index) {
        const header = sortDirectionIndex.at(index) as {
            index: number;
            sortDirection: "none" | "ascending" | "descending";
        };
        if (header.sortDirection === "none") header.sortDirection = "descending";
        else if (header.sortDirection === "descending") header.sortDirection = "ascending";
        else header.sortDirection = "descending";

        sortDirectionIndex.splice(index, 1, header);
        // force svelte to rerender array change
        sortDirectionIndex = sortDirectionIndex;

        dispatch("sort", index);
    }
</script>

{#each headers as header, index (index)}
    <th aria-sort={sortDirectionIndex[index].sortDirection}>
        <div class="fr-cell--sort">
            <span class="fr-cell__title">{header.name}</span>
            {#if header.tooltip}
                <span aria-describedby="header-tooltip-{index}" class="fr-icon-question-line high-blue-france fr-ml-2v">
                </span>
                <Tooltip id="header-tooltip-{index}"><p>{header.tooltip}</p></Tooltip>
            {/if}
            <ButtonSort
                on:click={() => handleSort(index)}
                id="table-{id}-{index}-sort-asc-desc"
                sortDirection={sortDirectionIndex[index].sortDirection} />
        </div>
    </th>
{/each}
