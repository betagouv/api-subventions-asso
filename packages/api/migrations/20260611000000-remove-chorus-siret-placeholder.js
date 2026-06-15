module.exports = {
    async up(db) {
        await db.collection("chorus").updateMany({ siret: "#" }, { $unset: { siret: 1 } });
    },
};
