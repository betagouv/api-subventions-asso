module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await db.collection("consumer-token").createIndex({ token: 1 }, { unique: true });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {},
};
