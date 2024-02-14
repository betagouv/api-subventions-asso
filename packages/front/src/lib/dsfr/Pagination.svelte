<script lang="ts">
    import type Store from "$lib/core/Store";

    export let totalPages: Store<number>;
    export let currentPage: Store<number>;

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.set(page);
    };

    const visibleLinks: { isCurrent: boolean; pageNumber: number }[] = [];

    currentPage.subscribe(currentPage => definePages(currentPage));
    totalPages.subscribe(_totalPages => definePages(1));

    function definePages(currentIndex) {
        visibleLinks.length = 0;

        for (let i = 0; i < $totalPages; i++) {
            const pageNumber = i + 1;
            visibleLinks.push({
                isCurrent: pageNumber === currentIndex,
                pageNumber: pageNumber,
            });
        }
    }
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<nav role="navigation" class="fr-pagination" aria-label="Pagination">
    <ul class="fr-pagination__list">
        {#if $currentPage != 1}
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
            <li>
                <a
                    class="fr-pagination__link"
                    aria-current={visibleLink.isCurrent ? "page" : null}
                    title="Page {visibleLink.pageNumber}"
                    href="#{visibleLink.pageNumber}"
                    on:click={() => changePage(visibleLink.pageNumber)}>
                    {visibleLink.pageNumber}
                </a>
            </li>
        {/each}
        {#if $currentPage != $totalPages}
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
