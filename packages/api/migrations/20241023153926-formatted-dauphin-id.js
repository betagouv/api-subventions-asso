module.exports = {
    async up(db) {
        await db
            .collection("dauphin-gispro")
            .aggregate([
                {
                    $addFields: {
                        "dauphin.codeActionProjet": {
                            $arrayElemAt: [{ $split: ["$dauphin.referenceAdministrative", "-"] }, 0],
                        },
                    },
                },
                { $out: "dauphin-gispro" },
            ])
            .toArray();
    },

    async down(db) {
        await db.collection("dauphin-gispro").updateMany({}, { $unset: "$dauphin.codeActionProject" });
    },
};
