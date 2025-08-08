module.exports = {
    async up(db) {
        await db.renameCollection("dauphin-gispro", "dauphin");
    },

    async down(db) {
        await db.renameCollection("dauphin", "dauphin-gispro");
    },
};
