module.exports = {
    async up(db) {
        await db.collection("chorus-line").drop();
    },
};
