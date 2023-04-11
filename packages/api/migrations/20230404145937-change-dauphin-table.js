/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: dauphinGisproRepository,
} = require("../build/src/modules/providers/dauphin/repositories/dauphin-gispro.repository");

const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");

module.exports = {
    async up(db) {
        await connectDB();

        const collection = db.collection("dauphin-caches");
        await collection.dropIndexes();

        console.log("Start update all entities");
        const cursor = collection.find();
        let i = 0;

        for await (const entity of cursor) {
            const updateQuery = {
                $unset: {
                    ...Object.keys(entity).reduce((acc, key) => {
                        if (key == "_id") return acc;
                        acc[key] = "";
                        return acc;
                    }, {}),
                },
                $set: { dauphin: entity },
            };

            await collection.updateOne({ _id: entity._id }, updateQuery);
            i++;
            printAtSameLine(i + " entites saved");
        }

        console.log("All entities has been updated");

        console.log("Rename collection");
        await collection.rename("dauphin-gispro");
        console.log("Rename collection are finished");

        console.log("Create new indexes");
        await dauphinGisproRepository.createIndexes();
        console.log("All new indexes has been created");

        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    },

    async down() {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
