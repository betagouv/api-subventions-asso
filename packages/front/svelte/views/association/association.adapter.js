import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";
import { flatenProviderValue } from "../../helpers/dataHelper";


export const toAssociationView = association => {
    const getRnaOrSirenValue = prop => association[`${prop}_rna`] ?  ProviderValueHelper.getValue(association[`${prop}_rna`]) : ProviderValueHelper.getValue(association[`${prop}_siren`])
    // Merge rna and siren fields and choose RNA as default
    // Remove this line if both are needed in front app
    const denomination = getRnaOrSirenValue("denomination");
    const dateCreation = getRnaOrSirenValue("date_creation");
    const dateModif = getRnaOrSirenValue("date_modification");
    // Remove RNA and SIREN fields
    delete association.denomination_rna;
    delete association.denomination_siren;
    delete association.date_creation_rna;
    delete association.date_creation_siren;
    delete association.date_modification_rna;
    delete association.date_modification_siren;
    return {
        ...flatenProviderValue(association),
        denomination,
        date_creation: dateCreation,
        date_modification: dateModif
    };
};

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
