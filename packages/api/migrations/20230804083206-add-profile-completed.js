const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        await connectDB();

        await db.collection("users").updateMany({}, { $set: { profileToComplete: false } });
    },

    async down() {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
