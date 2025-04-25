import {
    get,
    writable,
    derived as nativeDerived,
    readable,
    type Unsubscriber,
    Writable,
    Readable,
    Subscriber,
    Invalidator,
    StoresValues,
    Stores,
    Updater,
} from "svelte/store";

type GenericStore<T> = Writable<T> | Readable<T>;

class CoreStore<T, SomeStore extends GenericStore<T>> implements Readable<T> {
    protected _store: SomeStore;

    constructor(value: T, constructor: (value: T) => SomeStore) {
        this._store = constructor(value);
    }

    subscribe(callback: Subscriber<T>, invalidator?: Invalidator<T>): Unsubscriber {
        const unsubscriber = this._store.subscribe(callback, invalidator);

        return (...agrs: unknown[]) => unsubscriber(...(agrs as []));
    }
}

export class ReadStore<T> extends CoreStore<T, Readable<T>> implements Readable<T> {
    constructor(initialValue: T) {
        super(initialValue, readable);
    }

    public get value(): T {
        return get(this._store);
    }

    static fromSvelteStore<T>(svelteStore: Readable<T>) {
        const res = new ReadStore<T>(undefined as T);
        res._store = svelteStore;
        return res;
    }
}

export default class Store<T> extends CoreStore<T, Writable<T>> implements Writable<T> {
    constructor(initialValue: T) {
        super(initialValue, writable);
    }

    set(value: T) {
        this._store.set(value);
    }

    update(callback: Updater<T>) {
        this._store.update(callback);
    }

    get value(): T {
        // duplicated code because typescript is weird
        // https://stackoverflow.com/questions/38717725/why-cant-get-superclasss-property-by-getter-typescript
        return get(this._store);
    }

    set value(value: T) {
        this.set(value);
    }

    static fromSvelteStore<T>(svelteStore: Writable<T>) {
        const res = new Store<T>(undefined as T);
        res._store = svelteStore;
        return res;
    }
}

export function derived<S extends Stores, T>(refStores: S, callback: (values: StoresValues<S>) => T) {
    return ReadStore.fromSvelteStore(nativeDerived(refStores, callback));
}
