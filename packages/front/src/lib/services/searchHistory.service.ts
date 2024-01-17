import type { SearchHistory } from "$lib/types/SearchHistory";
import localStorageService from "$lib/services/localStorage.service";
import type { ReadStore } from "$lib/core/Store";

export const updateSearchHistory = (currentSearch: SearchHistory) => {
    let history = localStorageService.getItem("search-history").value || [];
    const currentSearchIndex = history.findIndex(search => search.rna === currentSearch.rna);
    // update current search to fill new design
    // TODO: remove this condition in few weeks/months
    if (currentSearchIndex >= 0) {
        history[currentSearchIndex] = currentSearch;
        localStorageService.setItem("search-history", history);
    } else {
        history.push(currentSearch);
        if (history.length > 3) history = history.slice(1);
        localStorageService.setItem("search-history", history);
    }
};

export function clearSearchHistory() {
    // @ts-expect-error: bug
    localStorageService.setItem("search-history", []);
}
export const getSearchHistory = () => localStorageService.getItem("search-history", []) as ReadStore<SearchHistory[]>;

export const checkOrDropSearchHistory = (newUserId: string) => {
    localStorageService.getItem("search-history", []);
    const previousUserId = localStorageService.getItem("previous-user-id").value;
    if (previousUserId === newUserId) return;
    clearSearchHistory();
    localStorageService.setItem("previous-user-id", newUserId);
};
