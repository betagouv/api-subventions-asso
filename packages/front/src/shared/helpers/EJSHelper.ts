import AdresseHelper from "./AdresseHelper";
import DateHelper from "./DateHelper";
import ProviderValueHelper from "./ProviderValueHelper";

export default {
    getValue: ProviderValueHelper.getValue,
    hasValue: ProviderValueHelper.hasValue,
    
    adresse: {
        toString: AdresseHelper.providerValuesToString
    },
    date: {
        toString: DateHelper.formatDate
    }
}