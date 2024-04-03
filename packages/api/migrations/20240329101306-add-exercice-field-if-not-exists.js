module.exports = {
    async up(db) {
        const COLLECTION = "misc-scdl-grant";

        await db
            .collection(COLLECTION)
            .aggregate([
                {
                    $addFields: { exercice: { $ifNull: ["$exercice", { $year: "$conventionDate" }] } },
                },
                {
                    $out: COLLECTION,
                },
            ])
            .toArray();
    },
};
