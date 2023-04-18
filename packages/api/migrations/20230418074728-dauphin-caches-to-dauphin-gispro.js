// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: dauphinGisproRepository,
} = require("../build/src/modules/providers/dauphin/repositories/dauphin-gispro.repository");

module.exports = {
    async up(db) {
        await connectDB();

        const collectionsList = await db.listCollections().toArray();

        if (!collectionsList.map(({ name }) => name).includes("dauphin-caches")) {
            console.log("Migration is already apply");
            return;
        }

        await dauphinGisproRepository.migrateDauphinCacheToDauphinGispro();
    },

    async down() {
        // TODO write the statements to rollback your migration (if possible)
    },
};
