import { getDate, getProvider, flattenProviderValue } from "$lib/helpers/providerValueHelper";

export const toDocumentComponent = document => {
    return {
        ...flattenProviderValue(document),
        provider: getProvider(document.nom),
        date: new Date(getDate(document.nom)),
    };
};
