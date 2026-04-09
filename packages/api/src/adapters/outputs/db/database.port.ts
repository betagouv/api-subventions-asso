export default interface DatabasePort<T> {
    insertMany?(entities: T[]): Promise<void>;
}
