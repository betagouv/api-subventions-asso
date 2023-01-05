import migrationManager from "../../src/shared/MigrationManager";
import MigrationRepository from "../../src/shared/MigrationRepository";
import db from "../../src/shared/MongoConnection";

describe("MigrationManager", () => {
    class FakeRepo extends MigrationRepository<{ content: string }> {
        collectionName = "fake";

        get publicCollection() {
            return this.collection;
        }
    }

    let repo: FakeRepo;

    beforeEach(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        migrationManager.migrationsRepositories.length = 0;
        repo = new FakeRepo();
        await repo.publicCollection.deleteMany({});
    });

    afterEach(async () => {
        await migrationManager.endMigration();
    });

    describe("startMigration", () => {
        it("should create new collections", async () => {
            await migrationManager.startMigration();
            expect(repo.publicCollection.collectionName).toBe("fake-MIGRATION-DATABASE");
        });

        it("should duplicate collections", async () => {
            await repo.publicCollection.insertOne({ content: "TEST" });
            expect(repo.publicCollection.collectionName).toBe("fake");
            await migrationManager.startMigration();
            expect(repo.publicCollection.collectionName).toBe("fake-MIGRATION-DATABASE");

            expect(await repo.publicCollection.find().toArray()).toHaveLength(1);
            expect(await db.collection("fake").find().toArray()).toHaveLength(1);
            expect(await repo.publicCollection.find().toArray()).toEqual(await db.collection("fake").find().toArray());
        });

        it("should be duplicate collections with 1500 docs", async () => {
            await repo.publicCollection.insertMany(Array.from({ length: 1500 }, (v, i) => ({ content: "TEST-" + i })));
            expect(repo.publicCollection.collectionName).toBe("fake");
            await migrationManager.startMigration();
            expect(repo.publicCollection.collectionName).toBe("fake-MIGRATION-DATABASE");

            expect(await repo.publicCollection.find().toArray()).toHaveLength(1500);
            expect(await db.collection("fake").find().toArray()).toHaveLength(1500);
        });
    });
});
