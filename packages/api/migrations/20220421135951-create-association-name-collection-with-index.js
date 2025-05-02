module.exports = {
    async up(db) {
        await db.collection("association-name").createIndex({ siren: 1, rna: 1, name: 1 }, { unique: true });
    },
};
