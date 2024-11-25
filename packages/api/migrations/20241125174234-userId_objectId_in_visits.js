const { ObjectId } = require("mongodb");

module.exports = {
    async up(db) {
        const bulk = [];
        await db
            .collection("stats-association-visits")
            .find({ userId: { $type: "string" } })
            .forEach(visit => {
                bulk.push({
                    updateOne: {
                        filter: { _id: visit._id },
                        update: { $set: { userId: new ObjectId(visit.userId) } },
                    },
                });
            });

        await db.collection("stats-association-visits").bulkWrite(bulk);
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async down() {},
};
