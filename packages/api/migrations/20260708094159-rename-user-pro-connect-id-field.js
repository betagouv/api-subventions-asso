module.exports = {
    async up(db) {
        await db
            .collection("users")
            .updateMany({ agentConnectId: { $exists: true } }, { $rename: { agentConnectId: "proConnectId" } });
    },
};
