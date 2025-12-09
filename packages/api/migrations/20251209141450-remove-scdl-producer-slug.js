module.exports = {
    async up(db) {
        await db.collection("misc-scdl-producers").dropIndex("slug_1");
        await db.collection("misc-scdl-producers").updateMany({}, { $unset: { slug: 1 } });
    },
};
