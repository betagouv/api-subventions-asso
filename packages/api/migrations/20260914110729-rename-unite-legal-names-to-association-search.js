module.exports = {
    async up(db) {
        await db.renameCollection("unite-legal-names", "association-search");
    },
};
