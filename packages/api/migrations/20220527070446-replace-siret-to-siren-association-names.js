/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require('../build/src/shared/MongoConnection');
const { ObjectId } = require("mongodb");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");

module.exports = {
    async up(db, client) {
        await connectDB();
        await db.collection("association-name")
            .updateMany(
                { siren: { $exists: true }, $expr: { $gt: [{ $strLenCP: '$siren' }, 9] }},
                { $set: { "siren": siretToSiren("$siren") }}
            );
    },

    async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
