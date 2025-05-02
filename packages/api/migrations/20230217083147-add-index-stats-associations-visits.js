const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: statsAssociationsVisitPort,
} = require("../build/src/dataProviders/db/stats/statsAssociationsVisit.port");

module.exports = {
    async up() {
        await connectDB();

        await statsAssociationsVisitPort.createIndexes();
    },
};
