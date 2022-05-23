import AdresseHelper from "./AdresseHelper";
import CurrencyHelper from './CurrencyHelper';
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
        toString: AdresseHelper.providerValuesToString
    },
    phone: {
        format: PhoneHelper.formatWithSpace
    },
    date: {
        toProviderValueString: DateHelper.toProviderValueString,
        formatDate: DateHelper.formatDate,
        formatDateWithHour: DateHelper.formatDateWithHour
    },
    currency: {
        addSpaces: CurrencyHelper.numberWithSpaces
    },
    capitalizeFirstLetter: (str: string)=> str[0].toUpperCase() + str.slice(1).toLowerCase(),
}