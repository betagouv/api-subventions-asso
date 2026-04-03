const { connectDB } = require("../build/src/shared/MongoConnection");
const configRepo = require("../build/src/adapters/outputs/db/configurations/configurations.adapter").default;
module.exports = {
    async up() {
        await connectDB();

        await configRepo.upsert("DAUPHIN-TOKEN-AVAILABLE", {
            data: 1000 * 60 * 60 * 12,
        }); // 12h
    },
};
