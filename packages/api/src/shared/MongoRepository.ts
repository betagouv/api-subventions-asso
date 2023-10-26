import db from "./MongoConnection";

export default abstract class MongoRepository<T> {
    public abstract collectionName: string;

    protected db = db;

    protected get collection() {
        // @ts-expect-error: T is not a document
        return db.collection<T>(this.collectionName);
    }
}
