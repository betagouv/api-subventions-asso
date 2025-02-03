module.exports = {
    async up(db) {
        const scdlProducerCollection = db.collection("misc-scdl-producers");
        await scdlProducerCollection.updateOne({ slug: "lyon" }, { $set: { slug: "lyon-metropole" } });

        const scdlGrantCollection = db.collection("misc-scdl-grant");
        await scdlGrantCollection.updateMany({ producerSlug: "lyon" }, { $set: { producerSlug: "lyon-metropole" } });
    },

    async down(db) {
        const scdlProducerCollection = db.collection("misc-scdl-producers");
        await scdlProducerCollection.updateOne({ slug: "lyon-metropole" }, { $set: { slug: "lyon" } });

        const scdlGrantCollection = db.collection("misc-scdl-grant");
        await scdlGrantCollection.updateMany({ producerSlug: "lyon-metropole" }, { $set: { producerSlug: "lyon" } });
    },
};
