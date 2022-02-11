import ProviderValue from "../../@types/ProviderValue";

export default class ProviderValueAdapter {
    static toProviderValue<T>(value: T, provider: string, updated_at: Date): ProviderValue<T> {
        return {
            value,
            provider,
            last_update: updated_at,
            type: typeof value
        }
    }
}