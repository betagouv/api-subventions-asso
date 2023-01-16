/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db, client) {
        await connectDB();
        await db.collection("dauphin-caches").createIndex({ reference: 1 }, { unique: true, dropDups: true });
        await db.collection("dauphin-caches").createIndex({ "demandeur.SIRET.SIREN": 1 });
        await db.collection("dauphin-caches").createIndex({ "demandeur.SIRET.complet": 1 });
    },

    async down(db, client) {
        // PROUTE
    }
};
