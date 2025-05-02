const { connectDB } = require("../build/src/shared/MongoConnection");
const { default: osirisActionPort } = require("../build/src/dataProviders/db/providers/osiris/osiris.action.port");
const { default: osirisRequestPort } = require("../build/src/dataProviders/db/providers/osiris/osiris.request.port");

module.exports = {
    async up() {
        await connectDB();

        await osirisActionPort.createIndexes();
        await osirisRequestPort.createIndexes();
    },
};
