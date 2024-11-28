/* eslint-disable @typescript-eslint/no-var-requires*/
const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const osirisActionRepository = require("../build/src/dataProviders/db/providers/osiris/osiris.action.port").default;
const entity = require("../build/src/modules/providers/osiris/entities/OsirisRequestEntity").default;
const { GenericParser } = require("../build/src/shared/GenericParser");
/* eslint-enable @typescript-eslint/no-var-requires*/

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        console.log("Connect to DB");
        await connectDB();

        console.log("Start Osris action indexed siret migration");
        const cursor = osirisActionRepository.cursorFind();

        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.providerInformations = GenericParser.indexDataByPathObject(
                entity.indexedProviderInformationsPath,
                data,
            );
            await osirisActionRepository.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
