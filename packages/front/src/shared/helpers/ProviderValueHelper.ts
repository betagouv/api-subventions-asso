import { ProviderValues, ProviderValue } from "@api-subventions-asso/dto";

export default class ProviderValueHelper {
    static isProviderValue(value: unknown): value is ProviderValue<unknown> {
        return (
            !!value &&
            typeof value == "object" &&
            "value" in (value as ProviderValue<unknown>) &&
            "provider" in (value as ProviderValue<unknown>)
        );
    }

    static isProviderValues(values: unknown): values is ProviderValues {
        return (
            Array.isArray(values) &&
            !!values.filter(v => v).length &&
            values.every(v => ProviderValueHelper.isProviderValue(v))
        );
    }

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

        return (data as ProviderValue)?.last_update?.toString();
    }
}
