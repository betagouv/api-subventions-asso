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
