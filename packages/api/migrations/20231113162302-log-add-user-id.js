const { default: updateLogUserId } = require("../build/src/modules/stats/migrations/userId.migration");
module.exports = {
    async up(db) {
        await updateLogUserId(db);
    },
};
