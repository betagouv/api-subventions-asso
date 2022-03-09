import { ProviderValues } from "@api-subventions-asso/dto";
import ProviderValue from "@api-subventions-asso/dto/shared/ProviderValue";

export default class ProviderValueHelper {
    public static getValue<T>(data: ProviderValues<T> | ProviderValue<T>): T | undefined {
        if (Array.isArray(data)) {
            if (data.length === 0) return undefined;
            return data[0].value;
        }

        return (data as ProviderValue<T>)?.value;
    }

    public static hasValue(data: ProviderValues | ProviderValue) {
        if (Array.isArray(data)) {
            if (data.length === 0) return false;
            return true;
        }

        return !!(data as ProviderValue)?.value;
    }

    public static getProvider(data: ProviderValues | ProviderValue): string | undefined {
        if (Array.isArray(data)) {
            if (data.length === 0) return undefined;
            return data[0].provider;
        }

        return (data as ProviderValue)?.provider;
    }

    public static getDate(data: ProviderValues | ProviderValue): string | undefined {
        if (Array.isArray(data)) {
            if (data.length === 0) return undefined;
            return data[0].last_update.toString();
        }

        return (data as ProviderValue)?.last_update.toString();
    }
}