import Provider from "./@types/IProvider";

export function providersById<T extends Provider>(providersArray: T[]) {
    return providersArray.reduce((acc, service) => {
        acc[service.provider.id] = service;
        return acc;
    }, {}) as Record<string, T>;
}
