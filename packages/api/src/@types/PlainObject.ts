// used to define a type from an Entity which only keeps "plain data" (only class properties, no methods)
type PlainObject<T> = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export default PlainObject;
