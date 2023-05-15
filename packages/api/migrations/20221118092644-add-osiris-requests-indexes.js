const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const collection = db.collection("osiris-requests");
        collection.createIndex({ "legalInformations.siret": 1 });
        collection.createIndex({ "legalInformations.rna": 1 });
        collection.createIndex({ "providerInformations.osirisId": 1 }, { unique: true });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // NOT IMPLEMENTED
    },
};
