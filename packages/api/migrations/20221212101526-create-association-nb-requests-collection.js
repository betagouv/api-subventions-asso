// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();
        const visits = await db.createCollection("association-visits");
        const logs = db.collection("log");

        const projectIdentifierPipeline = [
            {
                $project: {
                    identifier: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: { $split: ["$meta.req.url", "/"] },
                                    as: "pathPart",
                                    cond: { $ne: ["", "$$pathPart"] }
                                }
                            },
                            -1
                        ]
                    },
                    monthYear: {
                        $dateFromParts: {
                            month: { $month: "$timestamp" },
                            year: { $year: "$timestamp" }
                        }
                    }
                }
            },
            {
                $project: {
                    identifier: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$identifier" }, 14] },
                            then: { $substr: ["$identifier", 0, 9] },
                            else: "$identifier"
                        }
                    },
                    monthYear: "$monthYear"
                }
            }
        ]; // extracts the identifier from the route

        const nameLookupPipeline = [
            { $match: { $expr: { $or: [{ $eq: ["$siren", "$$identifier"] }, { $eq: ["$rna", "$$identifier"] }] } } },
            { $sort: { lastUpdate: -1 } }
        ]; // selects best matching row from association-name

        const mainPipeline = [
            // filter corresponding logs
            { $match: { "meta.req.url": { $regex: /(search\/)?(association|etablissement)s?\/[A-Za-z0-9]+\/?$/ } } },

            ...projectIdentifierPipeline,

            // first groupement and count by association identifier
            { $group: { _id: { identifier: "$identifier", monthYear: "$monthYear" }, nbRequests: { $sum: 1 } } },

            // cross data from routes and association names
            {
                $lookup: {
                    from: "association-name",
                    let: { identifier: "$_id.identifier" }, // association identifier
                    pipeline: nameLookupPipeline,
                    as: "nameMatches"
                }
            },
            { $unwind: { path: "$nameMatches" } },

            // sum request of same association name called with different identifier
            { $sort: { "nameMatches.lastUpdate": 1 } },
            {
                $group: {
                    _id: { name: "$nameMatches.name", monthYear: "$_id.monthYear" },
                    nbRequests: { $sum: "$nbRequests" },
                    identifiers: { $mergeObjects: { siren: "$nameMatches.siren", rna: "$nameMatches.rna" } }
                }
            },
            {
                $group: {
                    _id: { identifiers: "$identifiers", monthYear: "$_id.monthYear" },
                    nbRequests: { $sum: "$nbRequests" }
                }
            },
            {
                $project: {
                    siren: "$_id.identifiers.siren",
                    rna: "$_id.identifiers.rna",
                    monthYear: "$_id.monthYear",
                    nbRequests: "$nbRequests"
                }
            },

            // outputs to new collection
            { $out: "association-visits" }
        ];
        await logs.aggregate(mainPipeline).toArray();
        visits.createIndex({ siren: 1, rna: 1, monthYear: -1 }, { unique: true });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        await connectDB();
        db.dropCollection("association-visits");
    }
};
