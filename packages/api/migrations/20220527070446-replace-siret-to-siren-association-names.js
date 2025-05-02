const { connectDB } = require("../build/src/shared/MongoConnection");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();

        const collection = db.collection("association-name");
        const cursor = collection.find({
            siren: { $exists: true },
            $expr: { $gt: [{ $strLenCP: "$siren" }, 9] },
        });

        console.log("Starting transforming siret to siren...");

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            doc.siren = siretToSiren(doc.siren);
            const { _id, ...entity } = doc;
            try {
                await collection.findOneAndUpdate({ _id: _id }, { $set: entity });
            } catch {
                await collection.deleteOne({ _id: _id });
            }
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
