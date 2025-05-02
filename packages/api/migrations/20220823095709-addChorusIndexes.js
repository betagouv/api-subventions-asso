const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        await connectDB();
        await db.collection("chorus-line").createIndex({ "indexedInformations.siret": 1 });
    },
};
