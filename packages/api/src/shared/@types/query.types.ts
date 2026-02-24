export type QueryFilter<T = unknown> = {
    [K in keyof T]?: T[K] | QueryOperators<T[K]>;
} & {
    [key: string]: unknown;
};

export type QueryOperators<T> = {
    gte?: T;
    gt?: T;
    lte?: T;
    lt?: T;
    in?: T[];
    nin?: T[];
};

export type QueryOptions = {
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
};
