const { default: userStatsService } = require("../build/src/modules/user/services/stats/user.stats.service");
const { default: configurationsService } = require("../build/src/modules/configurations/configurations.service");

module.exports = {
    async up(db) {
        await db.collection("users").updateMany({}, { $set: { searchCount: 0 } });
        await configurationsService.setLastUserStatsUpdate(new Date(0));
        await userStatsService.updateNbRequests();
    },

    async down(db) {
        await Promise.all([
            db.collection("users").updateMany({}, { $unset: { searchCount: "" } }),
            db.collection("configurations").deleteOne({ name: configurationsService.LAST_USER_STATS_UPDATE }),
        ]);
    },
};
