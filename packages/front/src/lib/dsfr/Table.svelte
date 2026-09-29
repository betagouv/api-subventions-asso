<script lang="ts">
    import { uuid } from "$lib/helpers/stringHelper";

    interface Props {
        id?: string;
        title?: string;
        hideTitle?: boolean;
        size?: "sm" | "md" | "lg";
        rows?: string[][];
        scrollable?: boolean;
        bordered?: boolean;
        // use custom layout (see CSS in the style)
        custom?: boolean;
        multiline?: boolean;
        // remove outer border
        customLight?: boolean;
        titleClass?: string;
        headers?: import("svelte").Snippet | string[];
        headersSize?: string[];
        children?: import("svelte").Snippet;
    }

    let {
        id = uuid(),
        title = "",
        hideTitle = false,
        size = "md",
        rows = [],
        scrollable = true,
        bordered = true,
        custom = false,
        multiline = false,
        customLight = false,
        titleClass = "",
        headers,
        headersSize = [],
        children,
    }: Props = $props();

    const tableClasses = $derived.by(() => {
        const classes = ["fr-table", `fr-table--${size}`];
        if (!scrollable) classes.push("fr-table--no-scroll");
        if (bordered) classes.push("fr-table--bordered");
        return classes.join(" ");
    });
</script>

<div class={tableClasses} id="table-component-{id}" class:custom-table={custom}>
    <div class="fr-table__wrapper">
        <div class="fr-table__container">
            <div class="fr-table__content">
                <table class:no-outer-border={customLight} id="table-{id}" class:fr-cell--multiline={multiline}>
                    <caption class:fr-sr-only={hideTitle} class={titleClass} aria-hidden={hideTitle}>{title}</caption>
                    <thead>
                        <tr>
                            {#if typeof headers === "function"}
                                {@render headers()}
                            {:else if Array.isArray(headers)}
                                {#each headers as header, index (header)}
                                    <th class={headersSize[index] ? `fr-cell--${headersSize[index]}` : ""}>
                                        {header}
                                    </th>
                                {/each}
                            {/if}
                        </tr>
                    </thead>
                    <tbody>
                        {#if children}{@render children()}{:else}
                            {#each rows as row, index (index)}
                                <tr id="table-{id}-row-key-{index}" data-row-key={index}>
                                    {#each row as cell, index (index)}
                                        <td>{cell}</td>
                                    {/each}
                                </tr>
                            {/each}
                        {/if}
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
</style>
