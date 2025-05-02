const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        await connectDB();
        const collection = db.collection("osiris-requests");
        const cursor = await collection.find({
            "providerInformations.status": null,
        });
        while (await cursor.hasNext()) {
            const { _id, ...doc } = await cursor.next();
            const status = doc.data["Dossier"]["Etat dossier"];
            const oldStatus = doc.providerInformations.status;
            console.log(`Replace ${oldStatus} with ${status}... for _id ${doc._id}`);
            doc.providerInformations.status = status;
            await collection.update({ _id: _id }, { $set: doc });
        }
    },
};
