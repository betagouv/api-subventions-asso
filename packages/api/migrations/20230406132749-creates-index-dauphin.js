/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: dauphinGisproRepository
} = require("../build/src/modules/providers/dauphin/repositories/dauphin-gispro.repository");


module.exports = {
    async up(db, client) {
        await connectDB();

        console.log("Create new indexes");
        await dauphinGisproRepository.createIndexes();
        console.log("All new indexes has been created");

        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
