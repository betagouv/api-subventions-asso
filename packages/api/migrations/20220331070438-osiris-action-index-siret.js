const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const migrationManager = require("../build/src/shared/MigrationManager").default;
const osirisActionPort = require("../build/src/dataProviders/db/providers/osiris/osiris.action.port").default;
const enity = require("../build/src/modules/providers/osiris/entities/OsirisActionEntity").default;
const { GenericParser } = require("../build/src/shared/GenericParser");

module.exports = {
    async up() {
        console.log("Start Osris action indexed siret migration");
        await connectDB();
        await migrationManager.startMigration();

        const cursor = osirisActionPort.cursorFind();

        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.indexedInformations = GenericParser.indexDataByPathObject(enity.indexedInformationsPath, data);
            await osirisActionPort.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        await migrationManager.endMigration();
    },
};
