module.exports = {
    async up(db, client) {
        await db.collection("consumer-token").createIndex({ token: 1 }, { unique: true });
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async down(db, client) {}
};
