import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";
import { flatenProviderValue } from "../../helpers/dataHelper";

export const toAssociationView = association => flatenProviderValue(association);

export const toEtablissementComponent = etablissement => {
    return flatenProviderValue(etablissement);
};

export const toDocumentComponent = document => {
    return {
        ...flatenProviderValue(document),
        provider: ProviderValueHelper.getProvider(document.nom),
        date: new Date(ProviderValueHelper.getDate(document.nom))
    };
};
