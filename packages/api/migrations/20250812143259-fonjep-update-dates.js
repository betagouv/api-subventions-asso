const { default: dataLogPort } = require("../build/src/dataProviders/db/data-log/dataLog.port.js");

module.exports = {
    async up(db) {
        const lastDate = await dataLogPort.getLastImportByProvider("fonjep");
        await db.collection("fonjepPoste").updateMany({}, { $set: { updateDate: lastDate } });
        await db.collection("fonjepTiers").updateMany({}, { $set: { updateDate: lastDate } });
        await db.collection("fonjepTypePoste").updateMany({}, { $set: { updateDate: lastDate } });
        await db.collection("fonjepVersement").updateMany({}, { $set: { updateDate: lastDate } });
        await db.collection("fonjepDispositif").updateMany({}, { $set: { updateDate: lastDate } });
    },

    async down(_db) {
        // no need for downgrade
    },
};
