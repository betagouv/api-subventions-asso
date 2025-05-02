const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const migrationManager = require("../build/src/shared/MigrationManager").default;
const port = require("../build/src/dataProviders/db/providers/chorus/chorus.line.port").default;
const enity = require("../build/src/modules/providers/chorus/entities/ChorusLineEntity").default;
const { GenericParser } = require("../build/src/shared/GenericParser");

module.exports = {
    async up() {
        console.log("Start Chorus indexed typeOperation migration");
        await connectDB();
        await migrationManager.startMigration();

        const cursor = port.cursorFind();
        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.indexedInformations = GenericParser.indexDataByPathObject(enity.indexedInformationsPath, data);
            await port.updateById(doc._id, doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        await migrationManager.endMigration();
    },
};
