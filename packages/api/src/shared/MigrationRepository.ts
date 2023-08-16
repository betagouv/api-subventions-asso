import migrationManager from "./MigrationManager";
import db from "./MongoConnection";

export default abstract class MigrationRepository<T> {
    public abstract collectionName: string;

    protected db = db;

    constructor() {
        migrationManager.addMigrationRepository(this as MigrationRepository<unknown>);
    }

    protected get collection() {
        if (this.collectionName === "migration-repository")
            throw new Error(`Please change the collection name, ${JSON.stringify(this)}`);

        // @ts-expect-error: TODO
        if (migrationManager.inMigration) return db.collection<T>(this.collectionName + "-MIGRATION-DATABASE");

        // @ts-expect-error: TODO
        return db.collection<T>(this.collectionName);
    }
}
