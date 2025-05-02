module.exports = {
    async up(db) {
        await db.collection("fonjep").drop();
    },
};
