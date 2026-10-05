module.exports = {
    async up(db) {
        await db.collection("association-search").drop(); // created from indexes
        await db.renameCollection("unite-legal-names", "association-search");
    },
};
