const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: statsAssociationsVisitAdapter,
} = require("../build/src/adapters/outputs/db/stats/statsAssociationsVisit.adapter");

module.exports = {
    async up() {
        await connectDB();

        await statsAssociationsVisitAdapter.createIndexes();
    },
};
