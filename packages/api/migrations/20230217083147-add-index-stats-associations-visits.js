const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: statsAssociationsVisitAdapter,
} = require("../build/src/dataProviders/db/stats/statsAssociationsVisit.adapter");

module.exports = {
    async up() {
        await connectDB();

        await statsAssociationsVisitAdapter.createIndexes();
    },
};
