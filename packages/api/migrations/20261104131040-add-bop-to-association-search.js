module.exports = {
    async up(db) {
        await db
            .collection("payments-flat")
            .aggregate(
                [
                    {
                        $match: {
                            fournisseur: "chorus",
                        },
                    },
                    {
                        $group: {
                            _id: {
                                siren: "$idEntrepriseBeneficiaire",
                                exercice: "$exerciceBudgetaire",
                            },
                            bops: { $addToSet: "$numeroProgramme" },
                            total: { $sum: "$montant" },
                            min: { $min: "$montant" },
                            max: { $max: "$montant" },
                            nb: { $sum: 1 },
                        },
                    },
                    { $set: { bops: { $sortArray: { input: "$bops", sortBy: 1 } } } },
                    { $sort: { "_id.siren": 1, "_id.exercice": 1 } },
                    // 2. un document par siret, années en paires clé/valeur
                    {
                        $group: {
                            _id: "$_id.siren",
                            subventions: {
                                $push: {
                                    k: { $toString: "$_id.exercice" },
                                    v: { bops: "$bops", total: "$total", min: "$min", max: "$max", nb: "$nb" },
                                },
                            },
                        },
                    },
                    // 3. { "2025": {...}, "2026": {...} }
                    { $set: { siren: "$_id", subventions: { $arrayToObject: "$subventions" } } },
                    // find every association document with this siren (any rna, or none)
                    {
                        $lookup: {
                            from: "association-search",
                            localField: "siren",
                            foreignField: "siren",
                            as: "assos",
                            pipeline: [{ $project: { siren: 1 } }],
                        },
                    },
                    { $unwind: "$assos" },

                    // one output document per association, keyed by its own _id
                    { $project: { _id: "$assos._id", subventions: 1 } },

                    {
                        $merge: {
                            into: "association-search",
                            on: "_id",
                            whenMatched: "merge",
                            whenNotMatched: "discard",
                        },
                    },
                ],
                { allowDiskUse: true },
            )
            .toArray();

        throw new Error("OK!");
    },
};
