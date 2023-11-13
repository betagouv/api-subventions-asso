import { Db } from "mongodb";

export default async function updateLogUserId(db: Db) {
    const collection = db.collection("log");
    await collection
        .aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { logEmail: "$meta.req.user.email" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$$logEmail", "$email"] } } },
                        { $project: { userId: { $convert: { input: "$_id", to: "string" } }, _id: 0 } },
                        { $limit: 1 },
                    ],
                    as: "stringUserIds",
                },
            },
            { $unwind: { path: "$stringUserIds", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    "meta.req.user._id": "$stringUserIds.userId",
                },
            },
            {
                $project: {
                    stringUserIds: 0,
                },
            },
            { $out: "log" },
        ])
        .toArray();

    await collection.updateMany(
        { "meta.req.user.email": { $exists: false } },
        {
            $unset: {
                "$meta.req.user": 1,
            },
        },
    );
}
