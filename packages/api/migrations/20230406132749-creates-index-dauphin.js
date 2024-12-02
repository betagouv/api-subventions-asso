/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const { default: dauphinGisproPort } = require("../build/src/dataProviders/db/providers/dauphin/dauphin-gispro.port");

module.exports = {
    async up() {
        await connectDB();

        console.log("Create new indexes");
        await dauphinGisproPort.createIndexes();
        console.log("All new indexes have been created");

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
