import ProviderValueHelper from "../../src/shared/helpers/ProviderValueHelper";

export const valueOrHyphen = value => value || "-";

export const flatenProviderValue = providerValueObject => {
    const reduceProviderValues = (acc, prop) => {
        return {
            ...acc,
            [prop]:
                ProviderValueHelper.isProviderValues(providerValueObject[prop]) ||
                ProviderValueHelper.isProviderValue(providerValueObject[prop])
                    ? ProviderValueHelper.getValue(providerValueObject[prop])
                    : flatenProviderValue(providerValueObject[prop])
        };
    };

    if (["number", "string"].includes(typeof providerValueObject) | !providerValueObject) return providerValueObject;

    if (Array.isArray(providerValueObject)) {
        return providerValueObject.map(ob => flatenProviderValue(ob));
    }

    const providerValueObjectProps = Object.keys(providerValueObject);
    return providerValueObjectProps.reduce(reduceProviderValues, {});
};

export const numberToEuro = value => {
    if (isNaN(value)) return;
    value = typeof value === "string" ? parseFloat(value) : value;
    // maximumFractionDigits: check if value have digits if not digits no display N,00
    return value.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: value % 1 ? 2 : 0
    });
};
