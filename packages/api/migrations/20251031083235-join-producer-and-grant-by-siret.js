module.exports = {
    async up(db) {
        await db.collection("misc-scdl-grant").updateMany({}, { $unset: { producerSlug: 1 } });
    },
};
