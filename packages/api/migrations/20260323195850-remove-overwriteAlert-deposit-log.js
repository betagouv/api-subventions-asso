module.exports = {
    async up(db) {
        const result = await db
            .collection("deposit-log")
            .updateMany({ overwriteAlert: { $exists: true } }, { $unset: { overwriteAlert: "" } });

        console.log(`Migration remove-overwriteAlert-deposit-log done: ${result.modifiedCount} document(s) updated`);
    },
};
