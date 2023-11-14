const updateLogUserId = require("../src/modules/stats/migrations/userId.migration");
module.exports = {
    async up(db) {
        await updateLogUserId(db);
    },
};
