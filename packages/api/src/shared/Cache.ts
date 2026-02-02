interface CacheValue<T> {
    validateDate: number;
    value: T;
}

export default class CacheData<T> {
    private collection = new Map<string, CacheValue<T>[]>();
    private lastGlobalCleanup = Date.now();

    constructor(private timeToCacheMS: number) {}

    private maybeCleanAll() {
        const now = Date.now();
        if (now - this.lastGlobalCleanup < this.timeToCacheMS) {
            return;
        }

        this.collection.forEach((values, key) => {
            const validValues = values.filter(v => v.validateDate > now);

            if (validValues.length === 0) {
                this.collection.delete(key);
            } else if (validValues.length !== values.length) {
                this.collection.set(key, validValues);
            }
        });

        this.lastGlobalCleanup = now;
    }

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

    public has(key: string): boolean {
        this.maybeCleanAll();
        return this.cleanKeyAndGet(key).length > 0;
    }

    private cleanKeyAndGet(key: string): CacheValue<T>[] {
        if (!this.collection.has(key)) return [];

        const values = this.collection.get(key)!;
        const now = new Date().getTime();

        const validValues = values.filter(value => value.validateDate > now);

        if (validValues.length !== values.length) {
            if (validValues.length === 0) {
                this.collection.delete(key);
            } else {
                this.collection.set(key, validValues);
            }
        }

        return validValues;
    }

    public destroy() {
        this.collection.clear();
    }
}
