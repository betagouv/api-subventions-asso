const { connectDB } = require("../build/src/shared/MongoConnection");

const {
    default: statsUniqueVisitByDayPort,
} = require("../build/src/dataProviders/db/stats/statsUniqueVisitByDay.port.js");

module.exports = {
    async up() {
        await connectDB();
        await statsUniqueVisitByDayPort.createCollectionFromStatsAssociationVisits();
    },
};
