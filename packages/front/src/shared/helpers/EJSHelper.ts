import AdresseHelper from "./AdresseHelper";
import DateHelper from "./DateHelper";
import ProviderValueHelper from "./ProviderValueHelper";

export default {
    getValue: ProviderValueHelper.getValue,
    hasValue: ProviderValueHelper.hasValue,
    getProvider: ProviderValueHelper.getProvider,
    getDate: ProviderValueHelper.getDate,

    toJSONFile: (data: unknown) => Buffer.from(JSON.stringify(data, null, 4)).toString("base64"),
    
    adresse: {
        toString: AdresseHelper.providerValuesToString
    },
    date: {
        toProviderValueString: DateHelper.toProviderValueString,
        formatDate: DateHelper.formatDate
    }
}