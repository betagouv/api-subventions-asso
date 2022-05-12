export interface ProviderValue<T=unknown> {
    provider: string,
    type: string,
    last_update: Date,
    value: T,
}

export type ProviderValues<T=unknown> = ProviderValue<T>[]