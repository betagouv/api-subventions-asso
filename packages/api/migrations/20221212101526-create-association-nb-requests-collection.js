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
                $addFields: {
                    identifier: { $regexFind: { input: "$meta.req.url", regex: /association\/([A-Za-z0-9]+)\/?$/ } }
                }
            },
            {
                $project: {
                    identifier: { $arrayElemAt: ["$identifier.captures", 0] },
                    monthYear: { $dateTrunc: { date: "$timestamp", unit: "month" } }
                }
            }
        ]; // extracts the identifier from the route

        const nameLookupPipeline = [
            { $addFields: { bothIdentifiers: { $and: [{ $lte: ["$rna", null] }, { $lte: ["$siren", null] }] } } },
            { $match: { $expr: { $or: [{ $eq: ["$siren", "$$identifier"] }, { $eq: ["$rna", "$$identifier"] }] } } },
            { $sort: { bothIdentifier: -1, lastUpdate: -1 } },
            { $limit: 1 },
            { $project: { name: "$name" } }
        ]; // selects best matching row from association-name

        const mainPipeline = [
            // filter corresponding logs
            { $match: { "meta.req.url": { $regex: /(search\/)?association\/[A-Za-z0-9]+\/?$/ } } },

            ...projectIdentifierPipeline,

            // first groupement and count by association identifier
            { $group: { _id: { identifier: "$identifier", monthYear: "$monthYear" }, nbRequests: { $count: {} } } },

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
            {
                $group: {
                    _id: { name: "$nameMatches.name", monthYear: "$_id.monthYear" },
                    nbRequests: { $sum: "$nbRequests" }
                }
            },

            // project to expected field names
            { $project: { name: "$_id.name", monthYear: "$_id.monthYear", nbRequests: "$nbRequests" } },

            // outputs to new collection
            { $out: "association-visits" }
        ];
        await logs.aggregate(mainPipeline).toArray();
        visits.createIndex({ name: 1, monthYear: -1 }, { unique: true });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        await connectDB();
        db.dropCollection("association-visits");
    }
};
