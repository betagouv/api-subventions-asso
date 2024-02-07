const { connectDB } = require("../src/shared/MongoConnection");

module.exports = {
    async up(db) {
        await connectDB();

        await db
            .collection("log")
            .aggregate([
                { $group: { _id: "$meta.req.user.email", lastActivityDate: { $max: "$timestamp" } } },
                { $out: "log-last-activity" },
            ])
            .toArray();

        await db
            .collection("users")
            .aggregate([
                {
                    $lookup: {
                        from: "log-last-activity",
                        localField: "email",
                        foreignField: "_id",
                        as: "lastActivityLog",
                    },
                },
                { $unwind: { path: "$lastActivityLog", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        lastActivityDate: {
                            $ifNull: [
                                "$lastActivityDate",
                                {
                                    $ifNull: [
                                        "$lastActivityLog.lastActivityDate",
                                        { $cond: { if: { $eq: ["$active", true] }, then: "$signupAt", else: null } },
                                    ],
                                },
                            ],
                        },
                    },
                },
                { $project: { lastActivityLog: 0 } },
                { $out: "users-last-activity" },
            ])
            .toArray();

        await db.collection("users-last-activity").createIndex({ email: 1 }, { unique: true });
        await db.renameCollection("users", "users-save");
        await db.renameCollection("users-last-activity", "users");
        await db.dropCollection("logs");
    },

    async down(db) {
        await db.dropCollection("log-last-activity");
    },
};
