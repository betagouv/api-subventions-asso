<script lang="ts">
    import { uuid } from "$lib/helpers/stringHelper";

    export let id: string = uuid();
    export let title = "";
    export let hideTitle = false;
    export let size: "sm" | "md" | "lg" = "md";
    export let rows: string[][] = [];
    export let scrollable = true;
    export let bordered = true;
    // use custom layout (see CSS in the style)
    export let custom = false;
    export let multiline = false;
    // remove outer border
    export let customLight = false;

    let tableClasses: string[] = ["fr-table", `fr-table--${size}`];
    if (!scrollable) tableClasses.push("fr-table--no-scroll");
    if (bordered) tableClasses.push("fr-table--bordered");
</script>

<div class={tableClasses.join(" ")} id="table-component-{id}" class:custom-table={custom}>
    <div class="fr-table__wrapper">
        <div class="fr-table__container">
            <div class="fr-table__content">
                <table class:no-outer-border={customLight} id="table-{id}" class:fr-cell--multiline={multiline}>
                    <caption class:fr-sr-only={hideTitle} aria-hidden={hideTitle}>{title}</caption>
                    <thead>
                        <tr>
                            <slot name="headers"></slot>
                        </tr>
                    </thead>
                    <tbody>
                        <slot>
                            {#each rows as row, index (index)}
                                <tr id="table-{id}-row-key-{index}" data-row-key={index}>
                                    {#each row as cell, index (index)}
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
</style>
