const { connectDB } = require("../build/src/shared/MongoConnection");
const configRepo = require("../build/src/dataProviders/db/configurations/configurations.port").default;
module.exports = {
    async up() {
        await connectDB();

        await configRepo.upsert("DAUPHIN-TOKEN-AVAILABLE", {
            data: 1000 * 60 * 60 * 12,
        }); // 12h
    },
};
