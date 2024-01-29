// TODO: make this file available to API and FRONT ? => Create a core/shared package ? Put it in DTO package because PV is related to DTO ?

export const flattenProviderValue = providerValueObject => {
    if (isProviderValue(providerValueObject)) {
        console.error(
            "You are not suppose to call flattenProviderValue with ProviderValue. Only ProviderValues and object containing ProviderValues are allowed",
        );
        return getValue(providerValueObject);
    }

    const reduceProviderValues = (acc, prop) => {
        return {
            ...acc,
            [prop]:
                isProviderValues(providerValueObject[prop]) || isProviderValue(providerValueObject[prop])
                    ? getValue(providerValueObject[prop])
                    : flattenProviderValue(providerValueObject[prop]),
        };
    };

    if (["number", "string"].includes(typeof providerValueObject) || !providerValueObject) return providerValueObject;

    if (Array.isArray(providerValueObject)) {
        return providerValueObject.map(ob => flattenProviderValue(ob));
    }

    // Else we got an object of provider value(s)
    const providerValueObjectProps = Object.keys(providerValueObject);
    return providerValueObjectProps.reduce(reduceProviderValues, {});
};

export const getObjectWithMetadata = providerValuesObject => {
    // if not a ProviderValues
    if (typeof providerValuesObject !== "object" || Array.isArray(providerValuesObject)) return providerValuesObject;
    return {
        ...flattenProviderValue(providerValuesObject),
        provider: getProvider(providerValuesObject.nom),
        date: new Date(getDate(providerValuesObject.nom)),
    };
};

export const getValue = pv => {
    return getPropFromProviderValue("value")(pv);
};

export const getProvider = pv => {
    return getPropFromProviderValue("provider")(pv);
};

export const getDate = pv => {
    return getPropFromProviderValue("last_update")(pv)?.toString();
};

export const getPropFromProviderValue = value => data => {
    if (!data) return undefined;
    if (Array.isArray(data)) {
        if (data.length === 0) return undefined;
        return data[0][value];
    }
    return data[value];
};

export const isProviderValue = value => {
    return !!value && typeof value == "object" && "value" in value && "provider" in value;
};

export const isProviderValues = values => {
    return Array.isArray(values) && !!values.filter(v => v).length && values.every(v => isProviderValue(v));
};
