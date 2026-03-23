module.exports = {
    async up(db) {
        await db.collection("chorus").updateMany({}, { $rename: { updated: "updateDate" } });
    },
};
