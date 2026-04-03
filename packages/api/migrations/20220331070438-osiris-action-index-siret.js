const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const migrationManager = require("../build/src/shared/MigrationManager").default;
const osirisActionAdapter = require("../build/src/adapters/outputs/db/providers/osiris/osiris.action.adapter").default;
const enity = require("../build/src/modules/providers/osiris/entities/OsirisActionEntity").default;
const { GenericParser } = require("../build/src/shared/GenericParser");

module.exports = {
    async up() {
        console.log("Start Osris action indexed siret migration");
        await connectDB();
        await migrationManager.startMigration();

        const cursor = osirisActionAdapter.cursorFind();

        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.indexedInformations = GenericParser.indexDataByPathObject(enity.indexedInformationsPath, data);
            await osirisActionAdapter.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        await migrationManager.endMigration();
    },
};
