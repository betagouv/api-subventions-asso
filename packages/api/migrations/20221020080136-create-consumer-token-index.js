module.exports = {
    async up(db, client) {
        await db.collection("consumer-token").createIndex({ token: 1 }, { unique: true });
    },

    async down(db, client) {}
};
