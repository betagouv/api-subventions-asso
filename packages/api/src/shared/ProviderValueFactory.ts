import ProviderValueAdapter from "./adapters/ProviderValueAdapter";

export default class ProviderValueFactory {
    static buildProviderValueAdapter(provider: string, dataDate: Date) {
        return <T>(value: T) => ProviderValueAdapter.toProviderValue(value, provider, dataDate)
    }

    static buildProviderValuesAdapter(provider: string, dataDate: Date) {
        return <T>(value: T) => ProviderValueAdapter.toProviderValues(value, provider, dataDate)
    }
}