module.exports = {
    async up(db) {
        const now = new Date();
        // @TODO: remove updatedDate completly (no internet at the moment)
        await db.collection("unite-legal-names").updateMany({}, { $set: { updatedDate: undefined, updateDate: now } });
    },
};
