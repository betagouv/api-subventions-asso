import MigrationRepository from "./MigrationRepository";
import db from "./MongoConnection";

export class MigrationManager {
    private migrationsRepositories: MigrationRepository<unknown>[] = [];

    public inMigration = false;

    public async startMigration() {
        await this.migrationsRepositories.reduce(async (acc, repo) => {
            await acc;
            return this.duplicate(repo.collectionName);
        }, Promise.resolve() as Promise<void>);
        this.inMigration = true;
    }

    public async endMigration() {
        this.inMigration = false;

        const listCollections = await db.listCollections().toArray();
        const collectionsName = listCollections.map(collection => collection.name);

        await this.migrationsRepositories.reduce(async (awaiter, repo) => {
            await awaiter;
            if (!collectionsName.includes(repo.collectionName)) return awaiter;
            await db.collection(repo.collectionName).rename(repo.collectionName + "-old");
            await db.collection(repo.collectionName + "-MIGRATION-DATABASE").rename(repo.collectionName);
            return db.collection(repo.collectionName + "-old").drop() as unknown as Promise<void>;
        }, Promise.resolve() as Promise<void>);
    }

    public addMigrationRepository(repo: MigrationRepository<unknown>) {
        this.migrationsRepositories.push(repo);
    }

    private async duplicate(tableName: string) {
        console.info("Duplication of", tableName, "in progess ...");
        const target = db.collection(`${tableName}-MIGRATION-DATABASE`);
        let batch = target.initializeOrderedBulkOp();
        let counter = 0;
        const source = db.collection(tableName);
        const cursor = source.find();
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            batch.insert(doc);
            counter++;
            if (counter % 1000 == 0) {
                await batch.execute();
                batch = target.initializeOrderedBulkOp();
            }
        }
        if (counter % 1000 != 0) await batch.execute();

        console.info("Duplication of", tableName, "Done");
    }
}

const migrationManager = new MigrationManager();

export default migrationManager;
