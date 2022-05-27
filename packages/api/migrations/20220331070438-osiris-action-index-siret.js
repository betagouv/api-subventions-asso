// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require('../build/src/shared/MongoConnection');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const migrationManager = require("../build/src/shared/MigrationManager").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const osirisActionRepository = require("../build/src/modules/providers/osiris/repositories/osiris.action.repository").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const enity = require("../build/src/modules/providers/osiris/entities/OsirisActionEntity").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ParseHelper = require("../build/src/shared/helpers/ParserHelper");

module.exports = {
    async up(db, client) {
        console.log("Start Osris action indexed siret migration");
        await connectDB();
        await migrationManager.startMigration();

        const cursor = osirisActionRepository.cursorFind();

        let counter = 0;
        while(await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.indexedInformations = ParseHelper.indexDataByPathObject(enity.indexedInformationsPath, data);
            await osirisActionRepository.update(doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        await migrationManager.endMigration();
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
