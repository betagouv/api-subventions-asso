module.exports = {
    async up(db) {
        await db.collection("misc-scdl-grant").updateMany({}, { $set: { updateDate: new Date("2025-06-27") } });
    },

    async down(db) {
        await db.collection("misc-scdl-grant").updateMany({}, { $unset: { updateDate: 0 } });
    },
};
