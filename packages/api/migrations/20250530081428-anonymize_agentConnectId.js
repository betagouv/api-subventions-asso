module.exports = {
    async up(db) {
        // delete proConectId from all authenticated user and never used connection attribute
        await db.collection("log").updateMany(
            { "meta.req.user.email": { $exists: true } },
            {
                $unset: { "meta.req.user.proConnectId": "", "meta.req.connection": "" },
                $set: { "meta.req.user.isAgentConnect": true },
            },
        );
    },

    async down() {},
};
