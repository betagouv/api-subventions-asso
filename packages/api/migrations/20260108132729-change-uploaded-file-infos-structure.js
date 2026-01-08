module.exports = {
    async up(db) {
        await db.collection("deposit-log").updateMany(
            {
                "uploadedFileInfos.errors": { $exists: true },
            },
            [
                {
                    $set: {
                        "uploadedFileInfos.errorStats": {
                            count: { $size: "$uploadedFileInfos.errors" },
                            errors: "$uploadedFileInfos.errors",
                        },
                    },
                },
                {
                    $unset: ["uploadedFileInfos.errors"],
                },
            ],
        );
    },
};
