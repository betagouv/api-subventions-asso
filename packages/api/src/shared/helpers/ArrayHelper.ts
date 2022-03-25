export async function asyncFilter<T>(array: T[], callback: (value: T, index: number) => Promise<boolean>): Promise<T[]> {
    return array.reduce(async (acc, value, index) => {
        const arrayResult = await acc;
        const result = await callback(value, index);
        if (result) arrayResult.push(value);
        return arrayResult;
    }, Promise.resolve([]) as Promise<T[]>);
}

export async function asyncForEach<T>(array: T[], callback: (value: T, index: number) => Promise<void>): Promise<void> {
    return array.reduce(async (acc, value, index) => {
        await acc;
        await callback(value, index);
        return acc;
    }, Promise.resolve() as Promise<void>);
}