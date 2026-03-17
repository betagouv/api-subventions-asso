module.exports = {
    async up(db) {
        await db
            .collection("chorus")
            .aggregate([
                {
                    $addFields: {
                        "indexedInformations.exercice": { $toInt: "$indexedInformations.exercice" },
                    },
                },
                { $out: "chorus-nb" },
            ])
            .toArray();
        await db.dropCollection("chorus");
        await db.renameCollection("chorus-nb", "chorus");
    },

    async down(db) {
        await db
            .collection("chorus")
            .aggregate([
                {
                    $addFields: {
                        "indexedInformations.exercice": { $toString: "$indexedInformations.exercice" },
                    },
                },
                { $out: "chorus-str" },
            ])
            .toArray();
        await db.dropCollection("chorus");
        await db.renameCollection("chorus-str", "chorus");
    },
};
