import { getDate, getProvider, flatenProviderValue } from "../../helpers/providerValueHelper";

export const toAssociationView = association => flatenProviderValue(association);

export const toEtablissementComponent = etablissement => {
    const { information_banquaire, ...etablissementWithoutInfoBancaire } = etablissement;
    return { information_banquaire, ...flatenProviderValue(etablissementWithoutInfoBancaire) };
};

export const toDocumentComponent = document => {
    return {
        ...flatenProviderValue(document),
        provider: getProvider(document.nom),
        date: new Date(getDate(document.nom))
    };
};
