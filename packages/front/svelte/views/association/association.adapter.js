import { getDate, getProvider, flatenProviderValue } from "../../helpers/providerValueHelper";

export const toDocumentComponent = document => {
    return {
        ...flatenProviderValue(document),
        provider: getProvider(document.nom),
        date: new Date(getDate(document.nom)),
    };
};
