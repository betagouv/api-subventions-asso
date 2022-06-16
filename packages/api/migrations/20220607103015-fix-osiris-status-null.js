/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require('../build/src/shared/MongoConnection');
// const osirisRequestRepository = require('../build/src/modules/providers/osiris/repositories/osiris.request.repository').default;

module.exports = {
    async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
        await connectDB();
        const collection = db.collection("osiris-requests");
        const cursor = await collection.find({"providerInformations.status": null});
        while (await cursor.hasNext()) {
            const { _id, ...doc } = await cursor.next();
            const status = doc.data["Dossier"]["Etat dossier"];
            const oldStatus = doc.providerInformations.status;
            console.log(`Replace ${oldStatus} with ${status}... for _id ${doc._id}`);
            doc.providerInformations.status = status;
            await collection.update({_id: _id }, { $set: doc });
        }
    },

    async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
