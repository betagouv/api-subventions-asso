import { ProviderValue, ProviderValues } from "@api-subventions-asso/dto";

export default class ProviderValueAdapter {

    static isProviderValue(value: unknown): value is ProviderValue<unknown> {
        return !!value 
                && "value" in (value as ProviderValue<unknown>) 
                && "provider" in (value as ProviderValue<unknown>);
    }

    static isProviderValues(values: unknown) : values is ProviderValues {
        return Array.isArray(values) 
            && !!values.filter(v => v).length 
            && values.every(v => ProviderValueAdapter.isProviderValue(v));
    }

    static toProviderValue<T>(value: T, provider: string, updated_at: Date): ProviderValue<T> {
        return { 
            value,
            provider,
            last_update: updated_at,
            type: typeof value
        }
    }

    static toProviderValues<T>(value: T, provider: string, updated_at: Date): ProviderValues<T> {
        return [{
            value,
            provider,
            last_update: updated_at,
            type: typeof value
        }]
    }
}