export interface DefaultObject<T = unknown> {
    [key: string]: T;
}

export type NestedDefaultObject<T> = DefaultObject<T | NestedDefaultObject<T>>;
