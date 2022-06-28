import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";

export const toAssociationView = association => {
    return flatenProviderValue(association);
}

export const toEtablissementComponent = etablissement => {
    return flatenProviderValue(etablissement);
}

export const flatenProviderValue = (providerValueObject) => {
    const reduceProviderValues = (acc, prop) => ({ ...acc, [prop]: ProviderValueHelper.getValue(providerValueObject[prop]) });
    const providerValueObjectProps = Object.keys(providerValueObject);
    return providerValueObjectProps.reduce(reduceProviderValues, {});
}
