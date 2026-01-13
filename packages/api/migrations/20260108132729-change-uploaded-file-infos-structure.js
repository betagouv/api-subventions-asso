module.exports = {
    async up(db) {
        const documentsToUpdate = await db
            .collection("deposit-log")
            .find({
                "uploadedFileInfos.errors": { $exists: true },
            })
            .toArray();

        let updatedCount = 0;
        for (const doc of documentsToUpdate) {
            const errorsArray = doc.uploadedFileInfos.errors;
            const errorStats = {
                count: errorsArray.length,
                errorSample: errorsArray,
            };

            await db.collection("deposit-log").updateOne(
                { _id: doc._id },
                {
                    $set: {
                        "uploadedFileInfos.errorStats": errorStats,
                    },
                    $unset: {
                        "uploadedFileInfos.errors": "",
                    },
                },
            );
            updatedCount++;
        }

        console.log(`${updatedCount} docs updated`);
    },
};
