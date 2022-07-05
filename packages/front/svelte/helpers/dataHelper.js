import ProviderValueHelper from "../../src/shared/helpers/ProviderValueHelper";

export const valueOrHyphen = value => value || "-";

export const flatenProviderValue = providerValueObject => {
    const reduceProviderValues = (acc, prop) => ({
        ...acc,
        [prop]: ProviderValueHelper.getValue(providerValueObject[prop])
    });
    const providerValueObjectProps = Object.keys(providerValueObject);
    return providerValueObjectProps.reduce(reduceProviderValues, {});
};

export const numberToEuro = value => {
    value = typeof value === "string" ? parseFloat(value) : value;
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
};
