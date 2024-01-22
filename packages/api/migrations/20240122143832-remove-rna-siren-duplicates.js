module.exports = {
    async up(db) {
        const collection = db.collection("rna-siren");
        const cursor = collection.aggregate(
            [
                {
                    $group: {
                        _id: { rna: "$rna", siren: "$siren" },
                        uniqueIds: { $addToSet: "$_id" },
                        count: { $sum: 1 },
                    },
                },
                { $match: { count: { $gt: 1 } } },
            ],
            { allowDiskUse: true },
        );

        while (await cursor.hasNext()) {
            const duplicate = await cursor.next();
            console.log(duplicate);
        }

        throw new Error("end");
    },
};
