module.exports = {
    async up(db, client) {
        await db.collection("association-name").createIndex({ siren: 1, rna: 1, name: 1 }, { unique: true });
    },
};
