const { connectDB } = require("../build/src/shared/MongoConnection");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");

module.exports = {
    async up(db) {
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
};
