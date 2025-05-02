const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        await connectDB();
        const collection = db.collection("osiris-requests");
        collection.createIndex({ "legalInformations.siret": 1 });
        collection.createIndex({ "legalInformations.rna": 1 });
        collection.createIndex({ "providerInformations.osirisId": 1 }, { unique: true });
    },
};
