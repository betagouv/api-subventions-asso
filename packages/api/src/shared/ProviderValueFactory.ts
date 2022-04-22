import ProviderValueAdapter from "./adapters/ProviderValueAdapter";

export default class ProviderValueFactory {
    static buildProviderValueAdapter(proivder: string, dataDate: Date) {
        return <T>(value: T) => ProviderValueAdapter.toProviderValue(value, proivder, dataDate)
    }

    static buildProviderValuesAdapter(proivder: string, dataDate: Date) {
        return <T>(value: T) => ProviderValueAdapter.toProviderValues(value, proivder, dataDate)
    }
}