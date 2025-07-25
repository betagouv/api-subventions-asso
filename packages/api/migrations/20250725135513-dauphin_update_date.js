const dauphinService = require("../build/src/modules/providers/dauphin-gispro/dauphin.service");

module.exports = {
    async up(db) {
        const lastDate = await dauphinService.getLastImportDate();
        db.collection("dauphin-gispro").updateMany({}, { $set: { "dauphin.updateDate": lastDate } });
    },

    async down(db) {
        db.collection("dauphin-gispro").updateMany({}, { $unset: { "dauphin.updateDate": 1 } });
    },
};
