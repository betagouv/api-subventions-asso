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
                    $set: {
                        "uploadedFileInfos.errorStats": {
                            count: { $size: "$uploadedFileInfos.errors" },
                            errorSample: "$uploadedFileInfos.errors",
                        },
                    },
                },
                {
                    $unset: ["uploadedFileInfos.errors"],
                },
                {
                    $merge: { into: "deposit-log" },
                },
            ])
            .toArray();
    },
};
