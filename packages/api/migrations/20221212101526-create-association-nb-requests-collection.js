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
            { $project: { identifier: { $arrayElemAt: ["$identifier.captures", 0] } } },
            { $group: { _id: "$identifier", nbRequests: { $count: {} } } }
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

            // cross data from routes and association names
            {
                $lookup: {
                    from: "association-name",
                    let: { identifier: "$_id" }, // association identifier
                    pipeline: nameLookupPipeline,
                    as: "nameMatches"
                }
            },
            { $unwind: { path: "$nameMatches" } },

            // sum request of same association name called with different identifier
            { $group: { _id: "$nameMatches.name", nbRequests: { $sum: "$nbRequests" } } },

            // project to expected field names
            { $project: { name: "$_id", nbRequests: "$nbRequests" } },

            // outputs to new collection
            { $out: "association-visits" }
        ];
        await logs.aggregate(mainPipeline).toArray();
        visits.createIndex({ name: 1 });
        visits.createIndex({ nbRequests: -1 });
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        await connectDB();
        db.dropCollection("association-visits");
    }
};
