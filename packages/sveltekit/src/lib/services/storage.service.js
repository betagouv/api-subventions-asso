import localStorageStore from '$lib/store/localStorage';
import { get } from "svelte/store";

export const updateSearchHistory = ({ rna, siren, name, objectSocial }) => {
    let history = get(localStorageStore.getParsedItem("search-history")) || [];
    if (history.find(search => search.rna === rna)) return;
    history.push({ rna, siren, name, objectSocial });
    if (history.length > 4) history = history.slice(1);
    localStorageStore.setItem("search-history", JSON.stringify(history));
};

export const getSearchHistory = () => localStorageStore.getParsedItem("search-history") || [];
