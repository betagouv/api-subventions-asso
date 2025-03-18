module.exports = {
    async up(db) {
        const bulk = [];
        await db
            .collection("chorus-line")
            .find({ "indexedInformations.exercice": { $type: "string" } })
            .forEach(line => {
                bulk.push({
                    updateOne: {
                        filter: { _id: line._id },
                        update: {
                            $set: { "indexedInformations.exercice": parseInt(line.indexedInformations.exercice) },
                        },
                    },
                });
            });
        if (bulk.length) await db.collection("chorus-line").bulkWrite(bulk);
    },

    async down(db) {
        const bulk = [];
        await db
            .collection("chorus-line")
            .find({ "indexedInformations.exercice": { $type: "string" } })
            .forEach(line => {
                bulk.push({
                    updateOne: {
                        filter: { _id: line._id },
                        update: {
                            $set: { "indexedInformations.exercice": line.indexedInformations.exercice.toString() },
                        },
                    },
                });
            });
        if (bulk.length) await db.collection("chorus-line").bulkWrite(bulk);
    },
};
