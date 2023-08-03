import localStorageStore from "$lib/store/localStorage";

export const updateSearchHistory = ({ rna, siren, name, objectSocial }) => {
    let history = localStorageStore.getParsedItem("search-history").value || [];
    if (history.find(search => search.rna === rna)) return;
    history.push({ rna, siren, name, objectSocial });
    if (history.length > 4) history = history.slice(1);
    localStorageStore.setItem("search-history", JSON.stringify(history));
};

export const getSearchHistory = () => localStorageStore.getParsedItem("search-history") || [];
