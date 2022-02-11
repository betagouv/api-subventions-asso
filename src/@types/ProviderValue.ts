export default interface ProviderValue<T> {
    provider: string,
    type: string,
    last_update: Date,
    value: T,
}