module.exports = {
    async up(db) {
        await db.collection("deposit-log").updateMany(
            {
                uploadedFileInfos: { $exists: true },
            },
            [
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
            ],
        );
    },
};
