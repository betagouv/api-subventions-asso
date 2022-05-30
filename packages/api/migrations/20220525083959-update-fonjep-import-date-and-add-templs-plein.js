/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require('../build/src/shared/MongoConnection');
const migrationManager = require("../build/src/shared/MigrationManager").default;
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const { ObjectId } = require('mongodb');

module.exports = {
    async up(db, client) {
        console.log("Connecting to DB...");
        await connectDB();
        await migrationManager.startMigration();
        const fonjepCollection = db.collection("fonjep");
        const cursor = db.collection("fonjep").find({});
        console.log("Starting fonjep update...");
        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const iso = new Date("2022-03-14").toISOString();
            await fonjepCollection.updateOne(
                { _id: ObjectId(doc._id) },
                { $set: 
                    { 
                        "indexedInformations.updated_at": new Date(iso), 
                        "indexedInformations.plein_temps": doc.data.PleinTemps
                    }
                }
            );
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
