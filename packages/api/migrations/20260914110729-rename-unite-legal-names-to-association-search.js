module.exports = {
    async up(db) {
        try {
            console.log("drop association-search");
            await db.collection("association-search").drop();
        } catch (err) {
            if (err.codeName !== "NamespaceNotFound") throw err;
        }
        await db.renameCollection("unite-legal-names", "association-search");
    },
};
