interface CacheValue<T> {
    validateDate: number;
    value: T;
}

export default class CacheData<T> {
    private collection = new Map<string, CacheValue<T>>();
    private lastGlobalCleanup = Date.now();

    constructor(private timeToCacheMS: number) {}

    public add(key: string, value: T) {
        this.maybeCleanAll();
        const cacheValue = {
            validateDate: Date.now() + this.timeToCacheMS,
            value,
        } as CacheValue<T>;

        this.collection.set(key, cacheValue);
    }

    public get(key: string): T | null {
        this.maybeCleanAll();
        const cacheValue = this.cleanKeyAndGet(key);
        return cacheValue ? cacheValue.value : null;
    }

    public destroy() {
        this.collection.clear();
    }

    private cleanKeyAndGet(key: string): CacheValue<T> | null {
        const value = this.collection.get(key)!;
        if (!value) return null;

        if (value.validateDate <= Date.now()) {
            this.collection.delete(key);
            return null;
        }

        return value;
    }

    private maybeCleanAll() {
        const timeToCleanup = Date.now() - this.lastGlobalCleanup > this.timeToCacheMS;

        if (!timeToCleanup) {
            return;
        }

        const now = Date.now();
        this.collection.forEach((_v, key) => {
            this.cleanKeyAndGet(key);
        });

        this.lastGlobalCleanup = now;
    }
}
