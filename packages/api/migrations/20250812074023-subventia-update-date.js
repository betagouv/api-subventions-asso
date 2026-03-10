const { default: dataLogAdapter } = require("../build/src/dataProviders/db/data-log/dataLog.adapter.js");

module.exports = {
    async up(db) {
        const lastDate = await dataLogAdapter.getLastImportByProvider("subventia").catch(_e => new Date());
        await db.collection("subventia").updateMany({}, { $rename: { exportDate: "updateDate" } });
        await db.collection("subventia").updateMany({}, { $set: { updateDate: lastDate } });
    },

    async down(_db) {
        // this is a one time migration to rename field and fix updateDate
    },
};
