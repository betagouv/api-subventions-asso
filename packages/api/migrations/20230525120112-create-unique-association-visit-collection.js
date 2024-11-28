const { connectDB } = require("../build/src/shared/MongoConnection");

const {
    default: statsUniqueVisitByDayRepository,
} = require("../build/src/dataProviders/db/stats/statsUniqueVisitByDay.port.js");

module.exports = {
    async up() {
        await connectDB();
        await statsUniqueVisitByDayRepository.createCollectionFromStatsAssociationVisits();
    },
};
