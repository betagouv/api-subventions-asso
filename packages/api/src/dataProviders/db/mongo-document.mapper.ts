export type MongoDocument<T> = T & { _id?: unknown };

export function removeMongoId<T>(document: MongoDocument<T>): T {
    const { _id, ...entity } = document;
    return entity as T;
}

export function removeMongoIds<T>(documents: MongoDocument<T>[]): T[] {
    return documents.map(removeMongoId);
}
