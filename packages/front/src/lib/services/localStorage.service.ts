import Store, { derived } from "$lib/core/Store";

type LocalStorageType = Record<string, string | undefined>;

export class LocalStorageService {
    private readonly _localStore: Store<LocalStorageType>;

    constructor() {
        const localStorageObject = JSON.parse(JSON.stringify(localStorage));
        this._localStore = new Store(localStorageObject);
    }

    _updateLocalStorage() {
        const localStorageObject = JSON.parse(JSON.stringify(localStorage));
        this._localStore.set(localStorageObject);
    }

    getItem(key: string, defaultValue: any = null) {
        return derived(this._localStore, storage =>
            storage[key] !== undefined && storage[key] !== "undefined"
                ? JSON.parse(storage[key] as string)
                : defaultValue,
        );
    }

    setItem(key: string, value: string) {
        if (value === undefined) return this.removeItem(key);
        localStorage.setItem(key, JSON.stringify(value));
        this._updateLocalStorage();
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
        this._updateLocalStorage();
    }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
