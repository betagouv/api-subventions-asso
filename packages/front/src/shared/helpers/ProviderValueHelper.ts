import { ProviderValues } from "@api-subventions-asso/dto";
import ProviderValue from "@api-subventions-asso/dto/shared/ProviderValue";

export default class ProviderValueHelper {
    public static getValue(data: ProviderValues | ProviderValue) {
        if (Array.isArray(data)) {
            if (data.length === 0) return undefined;
            return data[0].value;
        }

        return (data as ProviderValue).value;
    }

    public static hasValue(data: ProviderValues | ProviderValue) {
        if (Array.isArray(data)) {
            if (data.length === 0) return false;
            return true;
        }

        return !!(data as ProviderValue).value;
    }
}