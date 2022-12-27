// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const iconv = require("iconv-lite");

module.exports = {
    async up(db, client) {
        await connectDB();
        const collection = db.collection("association-name");
        const cursor = collection.find({
            provider: "API SIRENE données ouvertes + API Répertoire des Associations (RNA)"
        });

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            doc.name = iconv.decode(Buffer.from(doc.name.toLowerCase(), "binary"), "win1252").toUpperCase();
            const { _id, ...entity } = doc;
            try {
                await collection.findOneAndUpdate({ _id: _id }, { $set: entity });
            } catch (e) {
                // avoid duplicate error after rename
                continue;
            }
        }

        throw "";
    },

    async down(db, client) {
        // NOT IMPLEMENTED
    }
};
