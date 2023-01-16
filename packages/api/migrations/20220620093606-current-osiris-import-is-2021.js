/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const OsirisMigration = require("../build/src/modules/providers/osiris/osiris.migrations").default;

module.exports = {
    async up(db, client) {
        await connectDB();
        const migration = new OsirisMigration();

        await migration.setExtractYearOnOsirisEntities(2021);
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
