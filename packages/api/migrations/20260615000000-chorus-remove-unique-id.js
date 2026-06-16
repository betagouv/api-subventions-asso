module.exports = {
    async up(db) {
        const collection = db.collection("chorus");

        await collection.createIndex(
            {
                ej: 1,
                numPosteEJ: 1,
                numeroDemandePaiement: 1,
                numPosteDP: 1,
                codeSociete: 1,
                exercice: 1,
            },
            { unique: true },
        );

        const indexes = await collection.indexes();
        if (indexes.find(index => index.name === "uniqueId_1")) await collection.dropIndex("uniqueId_1");

        await collection.updateMany({ uniqueId: { $exists: true } }, { $unset: { uniqueId: "" } });
    },
};
