import ProviderValueMapper from "./mappers/provider-value.mapper";

export default class ProviderValueFactory {
    static buildProviderValueMapper(provider: string, dataDate: Date) {
        return <T>(value: T) => ProviderValueMapper.toProviderValue(value, provider, new Date(dataDate));
    }

    static buildProviderValuesMapper(provider: string, dataDate: Date) {
        return <T>(value: T) => ProviderValueMapper.toProviderValues(value, provider, new Date(dataDate));
    }
}
