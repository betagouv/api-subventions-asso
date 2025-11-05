module.exports = {
    async up(db) {
        await db.collection("misc-scdl-producers").updateMany({}, { $unset: { lastUpdate: 1 } });
    },
};
