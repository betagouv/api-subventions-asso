const { default: dataLogPort } = require("../build/src/dataProviders/db/data-log/dataLog.port.js");

module.exports = {
    async up(db) {
        const lastDate = await dataLogPort.getLastImportByProvider("osiris");
        await db.collection("osiris-requests").updateMany({}, { $set: { updateDate: lastDate } });
        await db.collection("osiris-actions").updateMany({}, { $set: { updateDate: lastDate } });
    },

    async down(db) {
        await db.collection("osiris-requests").updateMany({}, { $unset: { updateDate: 1 } });
        await db.collection("osiris-actions").updateMany({}, { $unset: { updateDate: 1 } });
    },
};
