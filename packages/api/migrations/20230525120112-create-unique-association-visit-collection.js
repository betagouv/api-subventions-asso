const { connectDB } = require("../build/src/shared/MongoConnection");

const {
    default: statsUniqueVisitByDayPort,
} = require("../build/src/dataProviders/db/stats/statsUniqueVisitByDay.adapter.js");

module.exports = {
    async up() {
        await connectDB();
        await statsUniqueVisitByDayPort.createCollectionFromStatsAssociationVisits();
    },
};
