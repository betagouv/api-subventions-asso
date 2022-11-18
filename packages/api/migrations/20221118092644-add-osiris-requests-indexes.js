// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require('../build/src/shared/MongoConnection');

module.exports = {
    async up(db, client) {
        await connectDB();
        const collection = db.collection("osiris-requests");
        collection.createIndex({"legalInformations.siret": 1});
        collection.createIndex({"legalInformations.rna": 1});
        collection.createIndex({"providerInformations.osirisId": 1});
    },

    async down(db, client) {
        // NOT IMPLEMENTED
    }
};
