interface CacheValue<T> {
    validateDate: number,
    value: T
}

export default class CacheData<T> {

    private collection = new Map<string, (CacheValue<T>)[]>();

    constructor(private timeToCacheMS: number) {}

    private cleanCache() {
        const now = new Date().getTime();
        this.collection.forEach((values, key) => {
            const newValues = values.filter( value => value.validateDate > now);

            if (!newValues.length) this.collection.delete(key);
            else this.collection.set(key, newValues);
        });
    }

    public add(key: string, value: T) {
        this.cleanCache();
        const values = [
            {
                validateDate: new Date().getTime() + this.timeToCacheMS,
                value
            }
        ] as CacheValue<T>[]
        if (this.collection.has(key)) values.push(...this.collection.get(key) as []);

        this.collection.set(key, values);
    }

    public get(key: string): T[] {
        this.cleanCache();

        if (!this.collection.has(key)) return [];

        return (this.collection.get(key) as CacheValue<T>[])
            .map(v => v.value);
    }

    public has(key: string): boolean {
        return !!this.get(key).length;
    }

    public destroy() {
        this.collection.clear();
    }
}