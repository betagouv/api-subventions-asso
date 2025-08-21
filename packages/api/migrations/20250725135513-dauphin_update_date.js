const { getLastImportDate } = require("../build/src/dataProviders/db/providers/dauphin/dauphin.port");

module.exports = {
    async up(db) {
        const lastDate = await getLastImportDate();
        db.collection("dauphin-gispro").updateMany({}, { $set: { "dauphin.updateDate": lastDate } });
    },

    async down(db) {
        db.collection("dauphin-gispro").updateMany({}, { $unset: { "dauphin.updateDate": 1 } });
    },
};
