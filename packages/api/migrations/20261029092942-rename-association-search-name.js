module.exports = {
    async up(db) {
        db.collection("association-search").updateMany({}, { $rename: { name: "names" } });
    },
};
