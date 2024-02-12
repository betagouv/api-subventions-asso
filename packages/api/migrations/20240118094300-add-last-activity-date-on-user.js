module.exports = {
    async up(db) {
        const collection = db.collection("users");
        await collection
            .aggregate([
                {
                    $lookup: {
                        from: "log",
                        let: { userEmail: "$email" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$$userEmail", "$meta.req.user.email"] } } },
                            { $sort: { timestamp: -1 } },
                            { $limit: 1 },
                            { $project: { lastActivityDate: "$timestamp" } },
                        ],
                        as: "logs",
                    },
                },
                { $unwind: { path: "$logs", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        lastActivityDate: { $ifNull: ["$logs.lastActivityDate", null] },
                    },
                },
                {
                    $project: {
                        logs: 0,
                    },
                },
                { $out: "users" },
            ])
            .toArray();
    },
};
