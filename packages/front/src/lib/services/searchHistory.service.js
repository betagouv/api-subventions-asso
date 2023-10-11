import localStorageService from "$lib/services/localStorage.service";

export const updateSearchHistory = ({ rna, siren, name, objectSocial }) => {
    let history = localStorageService.getItem("search-history").value || [];
    if (history.find(search => search.rna === rna)) return;
    history.push({ rna, siren, name, objectSocial });
    if (history.length > 4) history = history.slice(1);
    localStorageService.setItem("search-history", history);
};

export function clearSearchHistory() {
    localStorageService.setItem("search-history", []);
}

export const getSearchHistory = () => localStorageService.getItem("search-history", []);

export const checkOrDropSearchHistory = newUserId => {
    localStorageService.getItem("search-history", []);
    const previousUserId = localStorageService.getItem("previous-user-id").value;
    if (previousUserId === newUserId) return;
    clearSearchHistory();
    localStorageService.setItem("previous-user-id", newUserId);
};
