// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const osirisActionRepository =
    require("../build/src/modules/providers/osiris/repositories/osiris.action.repository").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const entity = require("../build/src/modules/providers/osiris/entities/OsirisRequestEntity").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ParseHelper = require("../build/src/shared/helpers/ParserHelper");

module.exports = {
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
            doc.providerInformations = ParseHelper.indexDataByPathObject(entity.indexedProviderInformationsPath, data);
            await osirisActionRepository.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
