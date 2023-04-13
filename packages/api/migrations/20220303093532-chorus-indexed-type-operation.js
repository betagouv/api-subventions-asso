// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const migrationManager = require("../build/src/shared/MigrationManager").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const repo = require("../build/src/modules/providers/chorus/repositories/chorus.line.repository").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const enity = require("../build/src/modules/providers/chorus/entities/ChorusLineEntity").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ParseHelper = require("../build/src/shared/helpers/ParserHelper");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        console.log("Start Chorus indexed typeOperation migration");
        await connectDB();
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        await migrationManager.startMigration();

        const cursor = repo.cursorFind();
        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const data = doc.data;
            doc.indexedInformations = ParseHelper.indexDataByPathObject(enity.indexedInformationsPath, data);
            await repo.updateById(doc._id, doc);
            counter++;
            printAtSameLine(counter.toString());
        }

        await migrationManager.endMigration();
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
