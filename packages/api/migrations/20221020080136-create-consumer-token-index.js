module.exports = {
    async up(db) {
        await db.collection("consumer-token").createIndex({ token: 1 }, { unique: true });
    },
};
