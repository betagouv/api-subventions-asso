const { getMD5 } = require("../build/src/shared/helpers/StringHelper");

module.exports = {
    // async up(db) {
    //     let batch = [];

    //     function addToBatch(grant, newId) {
    //         const { _id, ...updatedGrant } = grant; // remove previous custom _id
    //         updatedGrant._id = newId; // set new _id
    //         const query = {
    //             insertOne: updatedGrant,
    //         };
    //         batch.push(query);
    //     }

    //     const cursor = db.collection("misc-scdl-grant").find({});

    //     console.log(`Stacking pile...`);

    //     // while cursor we build batch of 10000
    //     while (await cursor.hasNext()) {
    //         const grant = await cursor.next();
    //         const newId = getMD5(JSON.stringify(grant.__data__));
    //         console.log(`Adding grant with new ID ${newId} to pile`);
    //         addToBatch(grant, newId);
    //         if (batch.length === 10000) {
    //             console.log("Start processing batch...");
    //             try {
    //                 await db.collection("misc-scdl-grant-new").bulkWrite(batch);
    //             } catch (e) {
    //                 console.error("Error processing batch:", e);
    //             }
    //             batch = [];
    //         }
    //     }

    //     console.log("Processing final batch...");

    //     // last batch
    //     await db.collection("misc-scdl-grant-new").bulkWrite(batch);

    //     console.log("End of process...");

    //     // just to avoid saving this migration now
    //     throw new Error("not now");
    // },

    async up(db) {
        let batch = [];
        function addToBatch(grant) {
            const newId = getMD5(`${grant.allocatorSiret}-${JSON.stringify(grant.__data__)}`);
            const { _id, ...updatedGrant } = grant; // remove previous custom _id
            updatedGrant._id = newId; // set new _id
            const query = {
                insertOne: updatedGrant,
            };
            batch.push(query);
        }

        console.log("getting grants");

        let skip = 0;
        let grants = await db.collection("misc-scdl-grant").find({}).limit(10000).toArray();

        while (grants.length > 0) {
            console.log("add to batch", grants.length);

            grants.forEach(addToBatch);

            console.log("writing batch");

            await db.collection("misc-scdl-grant-new").bulkWrite(batch, { ordered: false });

            skip += 10000;
            batch = [];

            console.log("getting next grants batch at", skip);

            grants = await db.collection("misc-scdl-grant").find({}).skip(skip).limit(10000).toArray();
        }

        throw new Error("not now");
    },
};
