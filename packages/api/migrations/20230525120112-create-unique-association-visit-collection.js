const { connectDB } = require("../build/src/shared/MongoConnection");

const {
    default: statsUniqueVisitByDayRepository,
} = require("../build/src/modules/stats/repositories/statsUniqueVisitByDay.repository.js");

module.exports = {
    async up() {
        await connectDB();
        await statsUniqueVisitByDayRepository.createCollectionFromStatsAssociationVisits();
    },
};
