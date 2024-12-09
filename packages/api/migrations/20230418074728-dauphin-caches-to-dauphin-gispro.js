const { connectDB } = require("../build/src/shared/MongoConnection");

const { default: dauphinGisproPort } = require("../build/src/dataProviders/db/providers/dauphin/dauphin-gispro.port");

module.exports = {
    async up(db) {
        await connectDB();

        const collectionsList = await db.listCollections().toArray();

        if (!collectionsList.map(({ name }) => name).includes("dauphin-caches")) {
            console.log("Migration is already apply");
            return;
        }

        await dauphinGisproPort.migrateDauphinCacheToDauphinGispro(console.log);
    },

    async down() {
        // TODO write the statements to rollback your migration (if possible)
    },
};
