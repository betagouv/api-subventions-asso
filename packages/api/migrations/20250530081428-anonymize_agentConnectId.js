module.exports = {
    async up(db) {
        const bulkWriteOps = [];

        // delete agentConectId from all authenticated user
        bulkWriteOps.push({
            updateMany: {
                filter: { "meta.req.user.email": { $exists: true } },
                update: {
                    $unset: { "meta.req.user.agentConnectId": "" },
                    $set: { "meta.req.user.isAgentConnect": true },
                },
            },
        });
        if (!bulkWriteOps.length) return;
        await db.collection("log").bulkWrite(bulkWriteOps);
    },
};
