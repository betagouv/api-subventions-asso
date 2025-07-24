const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: dauphinGisproPort,
} = require("../build/src/dataProviders/db/providers/dauphin-gispro/dauphin-gispro.port");

module.exports = {
    async up() {
        await connectDB();

        console.log("Create new indexes");
        await dauphinGisproPort.createIndexes();
        console.log("All new indexes have been created");
    },
};
