module.exports = {
    async up(db) {
        await db.collection("fonjep").drop();
        await db.createCollection("fonjepSubvention");
        await db.createCollection("fonjepVersement");
    },
};
