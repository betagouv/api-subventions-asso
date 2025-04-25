const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        await db.collection("dauphin-caches").createIndex({ reference: 1 }, { unique: true, dropDups: true });
        await db.collection("dauphin-caches").createIndex({ "demandeur.SIRET.SIREN": 1 });
        await db.collection("dauphin-caches").createIndex({ "demandeur.SIRET.complet": 1 });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // PROUTE
    },
};
