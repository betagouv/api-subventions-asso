module.exports = {
    async up(db) {
        const bulk = [];
        const userIds = [];
        await db
            .collection("log")
            .find({})
            .forEach(log => {
                const id = log.meta.req?.user?._id;
                if (id == null || userIds.includes(id)) return;
                userIds.push(log.meta.req.user._id);
                bulk.push({
                    updateMany: {
                        filter: { "meta.req.user._id": id },
                        update: { $set: { "meta.userId": id } },
                    },
                });
            });
        if (bulk.length) await db.collection("log").bulkWrite(bulk);
    },

    async down(db) {
        await db.collection("log").updateMany({}, { $unset: { "meta.userId": 1 } });
    },
};
