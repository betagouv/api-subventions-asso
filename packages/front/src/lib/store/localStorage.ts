import Store, { derived } from "$lib/core/Store";

type LocalStorageType = Record<string, string>;

export class LocalStorageStore {
    public localStore: Store<LocalStorageType>;

    constructor() {
        const localStorageObject = JSON.parse(JSON.stringify(localStorage));
        this.localStore = new Store(localStorageObject);
    }

    _updateLocalStorage() {
        const localStorageObject = JSON.parse(JSON.stringify(localStorage));
        this.localStore.set(localStorageObject);
    }

    getItem(key: string) {
        return derived(this.localStore, storage => (storage as LocalStorageType)[key] || null);
    }

    getParsedItem(key: string) {
        return derived(this.localStore, storage => JSON.parse((storage as LocalStorageType)[key]));
    }

    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
        this._updateLocalStorage();
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
        this._updateLocalStorage();
    }
}

const localStorageStore = new LocalStorageStore();
export default localStorageStore;
