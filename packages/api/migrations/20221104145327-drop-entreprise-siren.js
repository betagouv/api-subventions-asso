module.exports = {
    async up(db) {
        await db.collection("datagouv-entreprise-siren").drop();
    },
};
