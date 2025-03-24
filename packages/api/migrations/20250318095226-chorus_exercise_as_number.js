module.exports = {
    async up(db) {
        await db
            .collection("chorus-line")
            .aggregate([
                {
                    $addFields: {
                        "indexedInformations.exercice": { $toInt: "$indexedInformations.exercice" },
                    },
                },
                { $out: "chorus-line-nb" },
            ])
            .toArray();
        await db.dropCollection("chorus-line");
        await db.renameCollection("chorus-line-nb", "chorus-line");
    },

    async down(db) {
        await db
            .collection("chorus-line")
            .aggregate([
                {
                    $addFields: {
                        "indexedInformations.exercice": { $toString: "$indexedInformations.exercice" },
                    },
                },
                { $out: "chorus-line-str" },
            ])
            .toArray();
        await db.dropCollection("chorus-line");
        await db.renameCollection("chorus-line-str", "chorus-line");
    },
};
