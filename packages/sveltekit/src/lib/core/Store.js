import { writable } from "svelte/store";

export default class Store {
    constructor(initialValue) {
        this._store = writable(initialValue);
        this._value = initialValue;
    }

    set(value) {
        this._value = value;
        this._store.set(value);
    }

    update(callback) {
        this._store.update(currentStoreValue => {
            const newStoreValue = callback(currentStoreValue);
            this._value = newStoreValue;
            return newStoreValue;
        });
    }

    subscribe(callback, invalidator) {
        const unsubscriber = this._store.subscribe(callback, invalidator);

        return (...agrs) => unsubscriber(...agrs);
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this.set(value);
    }
}
