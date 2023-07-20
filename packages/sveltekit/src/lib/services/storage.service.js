export const updateSearchHistory = ({ rna, siren, name, objectSocial }) => {
    let history = JSON.parse(window.localStorage.getItem("search-history")) || [];
    if (history.find(search => search.rna === rna)) return;
    history.push({ rna, siren, name, objectSocial });
    if (history.length > 4) history = history.slice(1);
    window.localStorage.setItem("search-history", JSON.stringify(history));
};

export const getSearchHistory = () => JSON.parse(window.localStorage.getItem("search-history")) || [];
