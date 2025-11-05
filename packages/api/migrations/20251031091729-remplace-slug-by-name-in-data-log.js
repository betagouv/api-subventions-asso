module.exports = {
    async up(db) {
        const producers = await db.collection("misc-scdl-producers").find({}).toArray();
        const promises = producers.map(producer => {
            return db
                .collection("data-log")
                .updateMany({ providerId: producer.slug }, { $set: { providerId: producer.name } });
        });
        await Promise.all(promises);
    },
};
