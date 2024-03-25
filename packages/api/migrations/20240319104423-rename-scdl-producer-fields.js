module.exports = {
    async up(db) {
        await db.collection("misc-scdl-producers").updateMany(
            {},
            {
                $rename: {
                    producerId: "slug",
                    producerName: "name",
                },
            },
        );

        const producersCursor = await db.collection("misc-scdl-producers").find({});

        while (await producersCursor.hasNext()) {
            const producer = await producersCursor.next();
            if (!producer.siret) throw Error("You must define a SIRET for producers before applying this migration");
            await db.collection("misc-scdl-grant").updateMany(
                { producerId: producer.slug },
                {
                    $rename: { producerId: "producerSlug" },
                    $set: { allocatorName: producer.name, allocatorSiret: producer.siret },
                },
            );
        }
    },
};
