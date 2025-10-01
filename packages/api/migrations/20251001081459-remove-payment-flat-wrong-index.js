module.exports = {
    async up(db) {
        await db.collection("payments-flat").dropIndex("siret_1");
    },
};
