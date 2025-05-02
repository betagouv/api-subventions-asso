const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const osirisActionPort = require("../build/src/dataProviders/db/providers/osiris/osiris.action.port").default;
const entity = require("../build/src/modules/providers/osiris/entities/OsirisRequestEntity").default;
const { GenericParser } = require("../build/src/shared/GenericParser");

module.exports = {
    async up(db, client) {
        console.log("Connect to DB");
        await connectDB();

        console.log("Start Osris action indexed siret migration");
        const cursor = osirisActionPort.cursorFind();

        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.providerInformations = GenericParser.indexDataByPathObject(
                entity.indexedProviderInformationsPath,
                data,
            );
            await osirisActionPort.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }
    },
};
