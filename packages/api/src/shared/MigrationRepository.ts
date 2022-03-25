import migrationManager from "./MigrationManager";
import db from "./MongoConnection";

export default class MigrationRepository<T> {
    public collectionName = "migration-repository";

    protected db = db;

    constructor() {
        migrationManager.addMigrationRepository(this as MigrationRepository<unknown>);
    }

    protected get collection() {
        if (this.collectionName === "migration-repository") throw new Error(`Please change the collection name, ${JSON.stringify(this)}`);

        if (migrationManager.inMigration) return db.collection<T>(this.collectionName + "-MIGRATION-DATABASE");

        return db.collection<T>(this.collectionName);
    }
}