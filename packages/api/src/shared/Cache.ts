interface CacheValue<T> {
    validateDate: number;
    value: T;
}

export default class CacheData<T> {
    private collection = new Map<string, CacheValue<T>[]>();
    private lastGlobalCleanup = Date.now();

    constructor(private timeToCacheMS: number) {}

    public add(key: string, value: T) {
        this.maybeCleanAll();
        const values = [
            {
                validateDate: Date.now() + this.timeToCacheMS,
                value,
            },
        ] as CacheValue<T>[];
        if (this.collection.has(key)) values.push(...(this.collection.get(key) as []));

        this.collection.set(key, values);
    }

    public get(key: string): T[] {
        this.maybeCleanAll();
        return this.cleanKeyAndGet(key).map(value => value.value);
    }

    public destroy() {
        this.collection.clear();
    }

    private cleanKeyAndGet(key: string): CacheValue<T>[] {
        if (!this.collection.has(key)) return [];

        const values = this.collection.get(key)!;
        const validValues = values.filter(v => v.validateDate > Date.now());

        if (validValues.length === 0) {
            this.collection.delete(key);
        } else if (validValues.length !== values.length) {
            this.collection.set(key, validValues);
        }
        return validValues;
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
