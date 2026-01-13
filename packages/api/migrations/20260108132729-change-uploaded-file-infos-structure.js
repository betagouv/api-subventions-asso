module.exports = {
    async up(db) {
        await db
            .collection("deposit-log")
            .aggregate([
                {
                    $match: {
                        "uploadedFileInfos.errors": { $exists: true },
                    },
                },
                {
                    $addFields: {
                        "uploadedFileInfos.errorStats": {
                            count: { $size: "$uploadedFileInfos.errors" },
                            errorSample: "$uploadedFileInfos.errors",
                        },
                    },
                },
                {
                    $project: { "uploadedFileInfos.errors": 0 },
                },
                {
                    $merge: { into: "deposit-log" },
                },
            ])
            .toArray();
    },
};
