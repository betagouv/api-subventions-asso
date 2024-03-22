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
        console.log("MIGRATION OK !");
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    },
};
