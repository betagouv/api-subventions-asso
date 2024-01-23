const { connectDB } = require("../build/src/shared/MongoConnection");
const ranSirenPort = require("../build/src/dataProviders/db/rnaSiren/rnaSiren.port").default;

module.exports = {
    async up(db) {
        await connectDB();

        await db
            .collection("rna-siren")
            .aggregate(
                [
                    {
                        $group: {
                            _id: { rna: "$rna", siren: "$siren" },
                        },
                    },
                    {
                        $addFields: {
                            rna: "$_id.rna",
                            siren: "$_id.siren",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                        },
                    },
                    { $out: "rna-siren-clean" },
                ],
                { allowDiskUse: true },
            )
            .toArray();

        await db.collection("rna-siren").rename("rna-siren-old");
        await db.collection("rna-siren-clean").rename("rna-siren");

        await ranSirenPort.createIndexes();
    },
};
