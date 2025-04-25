const { ObjectId } = require("mongodb");
const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        console.log("Connecting to DB...");
        await connectDB();
        const fonjepCollection = db.collection("fonjep");
        const cursor = fonjepCollection.find({});
        console.log("Starting fonjep update...");
        let counter = 0;
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const iso = new Date("2022-03-14").toISOString();
            await fonjepCollection.updateOne(
                { _id: ObjectId(doc._id) },
                {
                    $set: {
                        "indexedInformations.updated_at": new Date(iso),
                        "indexedInformations.plein_temps": doc.data.PleinTemps,
                    },
                },
            );
            counter++;
            printAtSameLine(counter.toString());
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
