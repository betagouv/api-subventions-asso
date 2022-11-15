/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require('../build/src/shared/MongoConnection');
const dataGouvService = require('../build/src/modules/providers/datagouv/datagouv.service').default;

module.exports = {
    async up(db, client) {
        await connectDB();

        const collection = db.collection("association-name");
        console.log(dataGouvService.provider.name);

        await collection.updateMany(
            { provider: "Base Sirene des entreprises et de leurs établissements (data.gouv.fr)" },
            { $set: { provider: dataGouvService.provider.name }}
        );
    },

    async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
