module.exports = {
    async up(db) {
        const operations = [];
        const associationSearchCollection = db.collection("association-search");
        await associationSearchCollection.createIndex({ postalCodes: 1 });

        const cursor = db
            .collection("etablissement")
            .aggregate(
                [
                    { $match: { codePostalEtablissement: { $exists: true, $nin: [null, ""] } } },
                    { $group: { _id: "$siren", postalCodes: { $addToSet: "$codePostalEtablissement" } } },
                ],
                { allowDiskUse: true },
            );

        for await (const { _id: siren, postalCodes } of cursor) {
            operations.push({
                updateMany: {
                    filter: { siren },
                    update: { $set: { postalCodes: postalCodes.sort() } },
                },
            });

            if (operations.length < 1000) continue;
            await associationSearchCollection.bulkWrite(operations);
            operations.length = 0;
        }

        if (operations.length) await associationSearchCollection.bulkWrite(operations);
    },
};
