module.exports = {
    async up(db) {
        const COLLECTION = "misc-scdl-grant";

        await db
            .collection(COLLECTION)
            .aggregate([
                { $match: { exercice: { $exists: false } } },
                {
                    $addFields: {
                        exercice: { $year: "$conventionDate" },
                    },
                },
                {
                    $merge: {
                        into: COLLECTION,
                        on: "_id",
                        whenMatched: "replace",
                    },
                },
            ])
            .toArray();
    },
};
