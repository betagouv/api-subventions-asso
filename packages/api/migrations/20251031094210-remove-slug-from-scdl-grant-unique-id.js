const scdlService = require("../build/src/modules/providers/scdl/scdl.service").default;
const scdlGrantService = require("../build/src/modules/providers/scdl/scdl.grant.service").default;
module.exports = {
    async up(db) {
        let batch = [];

        function addToBatch(grant, newId) {
            const { _id, ...updatedGrant } = grant; // remove previous custom _id
            updatedGrant._id = newId; // set new _id
            const query = {
                insertOne: updatedGrant,
            };
            batch.push(query);
        }

        const cursor = db.collection("misc-scdl-grant").find({});

        console.log(`Stacking pile...`);

        // while cursor we build batch of 10000
        while (await cursor.hasNext()) {
            const grant = await cursor.next();
            if (!grant.allocatorSiret) throw new Error("no allocator siret : not possible", grant);
            const newId = scdlService._buildGrantUniqueId(grant, grant.allocatorSiret);
            console.log(`Adding grant with new ID ${newId} to pile`);
            addToBatch(grant, newId);
            if (batch.length === 10000) {
                console.log("Start processing batch...");
                try {
                    await db.collection("misc-scdl-grant-new").bulkWrite(batch);
                } catch (e) {
                    console.error("Error processing batch:", e);
                }
                batch = [];
            }
        }

        console.log("Processing final batch...");

        // last batch
        await db.collection("misc-scdl-grant-new").bulkWrite(batch);

        console.log("End of process...");

        console.log("Replacing old SCDL grant collection...");

        // keep a backup in case somthing went wrong
        await db
            .collection("misc-scdl-grant")
            .aggregate([{ $match: {} }, { $out: "misc-scdl-backup-no-slug" }])
            .toArray();
        await db.collection("misc-scdl-grant").drop();
        await db
            .collection("misc-scdl-grant-new")
            .aggregate([{ $match: {} }, { $out: "misc-scdl-grant" }])
            .toArray();
        await db.collection("misc-scdl-grant-new").drop();

        console.log("Removing old SCDL applications flat..");

        // clean application-flat from old scdl data
        await db.collection("applications-flat").deleteMany({ fournisseur: /scdl-/ });

        console.log("Building SCDL applications flat from new collection");

        await scdlGrantService.initApplicationFlat();
    },
};
