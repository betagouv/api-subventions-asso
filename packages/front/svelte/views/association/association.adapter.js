import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";

export const toAssociationView = association => {
    return flatenProviderValue(association);
}

export const toEtablissementComponent = etablissement => {
    return flatenProviderValue(etablissement);
}

export const toDocumentComponent = document => {
    return {
        ...flatenProviderValue(document),
        provider: ProviderValueHelper.getProvider(document.nom),
        date: new Date(ProviderValueHelper.getDate(document.nom)),
    };
}

export const flatenProviderValue = (providerValueObject) => {
    const reduceProviderValues = (acc, prop) => ({ ...acc, [prop]: ProviderValueHelper.getValue(providerValueObject[prop]) });
    const providerValueObjectProps = Object.keys(providerValueObject);
    return providerValueObjectProps.reduce(reduceProviderValues, {});
}
