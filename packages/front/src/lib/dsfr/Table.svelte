<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Button from "./Button.svelte";

    // TODO: make it possible to has column with custom length

    export let id: string = crypto.randomUUID();
    export let title = "Titre du tableau (caption)";
    export let hideTitle = false;
    export let size: "sm" | "md" | "lg" = "md";
    export let headers: string[];
    export let headersSize: ("xs" | "sm" | "md" | "lg")[] | undefined = undefined;
    export let rows: string[][] = [];
    export let scrollable = true;
    export let bordered = true;
    export let sortable = false;
    export let custom = false;
    export let multiline = false;
    // remove outer border
    export let customLight = false;
    export let customColSizes: (string | number)[] = [];

    let tableClasses: string[] = ["fr-table", `fr-table--${size}`];
    if (!scrollable) tableClasses.push("fr-table--no-scroll");
    if (bordered) tableClasses.push("fr-table--bordered");

    function getHeaderSize(index: number) {
        if (!headersSize || (custom && customColSizes)) return undefined;
        const size = headersSize[index];
        if (["xs", "sm", "md", "lg"].includes(size)) return `fr-col--${size}`;
        return undefined;
    }

    function getCustomWidth(index: number) {
        if (!customColSizes || !custom) return undefined;
        const size = customColSizes[index];
        if (!size) return undefined;
        if (typeof size === "number" || size.match(/^\d+$/)) return `${size}%`;
        if (size.match(/^\d+%$/)) return size;
        return undefined;
    }

    const dispatch = createEventDispatcher();

    function handleSort(index) {
        dispatch("sort", index);
    }
</script>

<div class={tableClasses.join(" ")} id="table-component-{id}" class:custom-table={custom}>
    <div class="fr-table__wrapper">
        <div class="fr-table__container">
            <div class="fr-table__content">
                <table class:no-outer-border={customLight} id="table-{id}" class:fr-cell--multiline={multiline}>
                    <caption class:fr-sr-only={hideTitle} aria-hidden={hideTitle}>{title}</caption>
                    <thead>
                        <tr>
                            {#each headers as header, index}
                                {#if sortable}
                                    <th class={getHeaderSize(index)} style:width={getCustomWidth(index)}>
                                        <div class="fr-cell--sort">
                                            <span class="fr-cell__title">{header}</span>
                                            <Button
                                                on:click={() => handleSort(index)}
                                                id="table-{id}-{index}-sort-asc-desc"
                                                styleClass="fr-btn--sort"
                                                size="small"
                                                trackingDisable={true} />
                                        </div>
                                    </th>
                                {:else}
                                    <th class={getHeaderSize(index)}>
                                        {header}
                                    </th>
                                {/if}
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        <slot>
                            {#each rows as row, index}
                                <tr id="table-{id}-row-key-{index}" data-row-key={index}>
                                    {#each row as cell}
                                        <td>{cell}</td>
                                    {/each}
                                </tr>
                            {/each}
                        </slot>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    /* CUSTOM */

    .custom-table .fr-table__wrapper::after {
        background: none;
    }

    .custom-table {
        margin-bottom: 0;
    }

    .custom-table :global(tbody tr):last-of-type {
        border-bottom: none;
    }

    .custom-table :global(tr.clickable) {
        cursor: pointer;
    }

    .custom-table :global(tr.clickable:hover td),
    :global(tr.clickable:focus-within td) {
        background-color: var(--background-alt-grey);
    }
</style>
