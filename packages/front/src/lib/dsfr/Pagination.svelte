<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type Store from "$lib/core/Store";

    const dispatch = createEventDispatcher();

    export let totalPages: number;
    export let currentPage: Store<number>;

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        currentPage.set(page);
        dispatch("change", page);
    };

    function numbersBetween(a: number, b: number) {
        return Array.from({ length: b - a + 1 }, (_, index) => index + a);
    }

    let visibleLinks: (number | null)[] = [];

    currentPage.subscribe(currentPage => (visibleLinks = definePages(currentPage)));

    function definePages(currentPage: number) {
        const maxVisiblePages = 10;
        const smallSliceSize = 1;
        const sliceSize = 3;

        // all pages
        if (totalPages <= maxVisiblePages) {
            return numbersBetween(1, totalPages);
        }

        // first n pages
        if (currentPage < sliceSize + 1) {
            return [
                ...numbersBetween(1, Math.max(sliceSize, currentPage + 1)),
                null,
                ...numbersBetween(totalPages - sliceSize + 1, totalPages),
            ];
        }

        // last n pages
        if (currentPage > totalPages - sliceSize) {
            return [
                ...numbersBetween(1, sliceSize),
                null,
                ...numbersBetween(Math.min(totalPages - sliceSize + 1, currentPage - 1), totalPages),
            ];
        }

        // slices
        return [
            ...numbersBetween(1, sliceSize),
            null,
            ...numbersBetween(currentPage - smallSliceSize, currentPage + smallSliceSize),
            null,
            ...numbersBetween(totalPages - sliceSize + 1, totalPages),
        ];
    }
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<nav role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list">
        {#if $currentPage !== 1}
            <li>
                <a
                    class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
                    href="#{$currentPage}"
                    on:click={() => changePage($currentPage - 1)}>
                    Page précédente
                </a>
            </li>
        {/if}
        {#each visibleLinks as visibleLink}
            {#if visibleLink}
                <li>
                    <a
                        class="fr-pagination__link"
                        aria-current={visibleLink === $currentPage ? "page" : null}
                        title="Page {visibleLink}"
                        href="#{visibleLink}"
                        on:click={() => {
                            if (visibleLink) changePage(visibleLink);
                        }}>
                        {visibleLink}
                    </a>
                </li>
            {:else}
                <li>
                    <span class="fr-pagination__link fr-label--disabled">...</span>
                </li>
            {/if}
        {/each}
        {#if $currentPage !== totalPages}
            <li>
                <a
                    class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
                    href="#{$currentPage + 1}"
                    on:click={() => changePage($currentPage + 1)}>
                    Page suivante
                </a>
            </li>
        {/if}
    </ul>
</nav>
