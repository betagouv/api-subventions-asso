import Provider from "./@types/IProvider";

export function providersById<T extends Provider>(providersArray: T[]) {
    return providersArray.reduce((acc, service) => {
        acc[service.meta.id] = service;
        return acc;
    }, {}) as Record<string, T>;
}
