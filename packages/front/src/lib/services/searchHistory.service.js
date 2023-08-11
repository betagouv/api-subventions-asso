import localStorageService from "$lib/services/localStorage.service";

export const updateSearchHistory = ({ rna, siren, name, objectSocial }) => {
    let history = localStorageService.getItem("search-history").value || [];
    if (history.find(search => search.rna === rna)) return;
    history.push({ rna, siren, name, objectSocial });
    if (history.length > 4) history = history.slice(1);
    localStorageService.setItem("search-history", history);
};

export const getSearchHistory = () => localStorageService.getItem("search-history", []);
