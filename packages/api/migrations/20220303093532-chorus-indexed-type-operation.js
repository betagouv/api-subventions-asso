const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const migrationManager = require("../build/src/shared/MigrationManager").default;
const repo = require("../build/src/dataProviders/db/providers/chorus/chorus.line.port").default;
const enity = require("../build/src/modules/providers/chorus/entities/ChorusLineEntity").default;
const { GenericParser } = require("../build/src/shared/GenericParser");

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
            doc.indexedInformations = GenericParser.indexDataByPathObject(enity.indexedInformationsPath, data);
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
