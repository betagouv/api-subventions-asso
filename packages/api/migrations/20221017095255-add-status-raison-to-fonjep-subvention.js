const { ObjectId } = require("mongodb");
const { connectDB } = require("../build/src/shared/MongoConnection");
const asyncForEach = require("../build/src/shared/helpers/ArrayHelper").asyncForEach;

module.exports = {
    async up(db) {
        await connectDB();
        const fonjepSubventionCollection = await db.collection("fonjepSubvention");
        const subventions = await fonjepSubventionCollection.find({}).toArray();
        console.log(`subventions length ${subventions.length}`);
        let updatePromises = [];

        let batchCount = 0;

        await asyncForEach(subventions, async subventionEntity => {
            const pstRaisonStatutLibelle = subventionEntity.data["PstRaisonStatutLibelle"];
            subventionEntity.indexedInformations.raison = pstRaisonStatutLibelle;
            const updatePromise = fonjepSubventionCollection.updateOne(
                { _id: ObjectId(subventionEntity._id) },
                { $set: subventionEntity },
            );
            updatePromises.push(updatePromise);
            batchCount++;
            if (batchCount == 1000) {
                console.log("await 1000 updates...");
                await Promise.all(updatePromises);
                console.log("updates done. reset updatePromises...");
                batchCount = 0;
                updatePromises = [];
            }
        });
    },
};
