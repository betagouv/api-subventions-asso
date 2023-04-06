import AdresseHelper from "./AdresseHelper";
import AmountHelper from "./AmountHelper";
import DateHelper from "./DateHelper";
import PhoneHelper from "./PhoneHelper";
import ProviderValueHelper from "./ProviderValueHelper";

export default {
    getValue: ProviderValueHelper.getValue,
    hasValue: ProviderValueHelper.hasValue,
    getProvider: ProviderValueHelper.getProvider,
    getDate: ProviderValueHelper.getDate,

    toJSONFile: (data: unknown) => Buffer.from(JSON.stringify(data, null, 4)).toString("base64"),
    returnValueOrHyphen: (value: unknown) => value || "-",

    adresse: {
        toString: AdresseHelper.providerValuesToString,
    },
    phone: {
        format: PhoneHelper.formatWithSpace,
    },
    date: {
        toProviderValueString: DateHelper.toProviderValueString,
        formatDate: DateHelper.formatDate,
        formatDateWithHour: DateHelper.formatDateWithHour,
    },
    capitalizeFirstLetter: (str: string | undefined) => (str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str),
    amount: {
        providerValueToEuro: AmountHelper.providerValueToEuro,
        numberToEuro: AmountHelper.numberToEuro,
    },
};
