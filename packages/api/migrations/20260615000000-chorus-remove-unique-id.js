const BATCH_SIZE = 5000;

module.exports = {
    async up(db) {
        const collection = db.collection("chorus");
        const operations = [];
        const cursor = collection.find(
            {
                $or: [
                    { numPosteEJ: { $type: "string" } },
                    { numPosteDP: { $type: "string" } },
                    { exercice: { $type: "string" } },
                ],
            },
            {
                projection: {
                    numPosteEJ: 1,
                    numPosteDP: 1,
                    exercice: 1,
                },
            },
        );

        for await (const document of cursor) {
            operations.push({
                updateOne: {
                    filter: { _id: document._id },
                    update: {
                        $set: {
                            numPosteEJ: Number(document.numPosteEJ),
                            numPosteDP: Number(document.numPosteDP),
                            exercice: Number(document.exercice),
                        },
                    },
                },
            });

            if (operations.length >= BATCH_SIZE) {
                await collection.bulkWrite(operations, { ordered: false });
                operations.length = 0;
            }
        }

        if (operations.length) await collection.bulkWrite(operations, { ordered: false });

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
