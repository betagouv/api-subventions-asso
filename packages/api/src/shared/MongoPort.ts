import db from "./MongoConnection";

export default abstract class MongoPort<T> {
    public abstract collectionName: string;
    public abstract createIndexes(): void;

    protected db = db;

    protected get collection() {
        // @ts-expect-error: T is not a document
        return db.collection<T>(this.collectionName);
    }
}
