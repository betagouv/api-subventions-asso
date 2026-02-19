export async function asyncFilter<T>(
    array: T[],

    callback: (value: T, index: number) => Promise<boolean>,
): Promise<T[]> {
    return array.reduce(
        async (acc, value, index) => {
            const arrayResult = await acc;
            const result = await callback(value, index);
            if (result) arrayResult.push(value);
            return arrayResult;
        },
        Promise.resolve([]) as Promise<T[]>,
    );
}

export async function asyncForEach<T>(array: T[], callback: (value: T, index: number) => Promise<void>): Promise<void> {
    return array.reduce(async (acc, value, index) => {
        await acc;
        await callback(value, index);
        return acc;
    }, Promise.resolve() as Promise<void>);
}

export const compareByValueBuilder = value => (a, b) => {
    if (!value.includes(".")) return compare(a[value], b[value]);
    const getDeepValueFromPath = getDeepValueFromArray(value.split("."));
    return compare(getDeepValueFromPath(a), getDeepValueFromPath(b));
};

export const getDeepValueFromArray = arr => obj => arr.reduce(reduceToDeepValue, obj);

export const reduceToDeepValue = (deepObject, deepValue) => deepObject[deepValue];

export const compare = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

export const joinEnum = obj => Object.values(obj).join(", ");

/**
 * Merge two Map object containing (key: string, value: any[])
 */
export const mergeMapArray = (mapA, mapB) => {
    const valueError = new Error("mergeMapArray only merge map objects containing arrays");

    for (const [key, valueB] of mapB) {
        if (!Array.isArray(valueB)) throw valueError;
        if (mapA.has(key)) {
            const valueA = mapA.get(key);
            if (!Array.isArray(valueA)) throw valueError;
            else mapA.set(key, valueA.concat(valueB));
        } else {
            mapA.set(key, valueB);
        }
    }

    return mapA;
};

/**
 * Return a reducer to group an array of items by a property value
 * @param key Property on which to perform the group by
 * @returns Reduce function
 */
export const groupByKeyFactory = (key: string) => {
    return (acc: Record<string, Record<string, unknown>[]>, obj: Record<string, unknown>) => {
        const keyValue = obj[key]
        if (typeof keyValue !== "string") throw new Error(`Items in array must have property "${key}" to perform the group by`);
        const { [key]: _, ...rest } = obj;
        (acc[keyValue] ??= []).push(rest);
        return acc;
    }
};