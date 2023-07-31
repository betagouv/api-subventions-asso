import { derived } from "svelte/store";
import Store from "$lib/core/Store";

export class LocalStorageStore {
    public localStore: Store;

    constructor() {
        const localStorageObject = JSON.parse(JSON.stringify(localStorage));
        this.localStore = new Store(localStorageObject);
    }

    _updateLocalStorage() {
        const localStorageObject = JSON.parse(JSON.stringify(localStorage));
        this.localStore.set(localStorageObject);
    }

    getItem(key: string) {
        return derived(this.localStore, storage => (storage as Record<string, string>)[key] || null);
    }

    getParsedItem(key: string) {
        return derived(this.localStore, storage => JSON.parse((storage as Record<string, string>)[key]));
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
