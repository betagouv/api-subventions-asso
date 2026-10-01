module.exports = {
    async up(db) {
        await db.collection("association-search").updateMany({}, { $unset: { updatedDate: "", updateDate: "" } });
    },
};
