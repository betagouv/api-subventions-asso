const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: osirisActionPort,
} = require("../build/src/adapters/outputs/db/providers/osiris/osiris.action.adapter");
const {
    default: osirisRequestPort,
} = require("../build/src/adapters/outputs/db/providers/osiris/osiris.request.adapter");

module.exports = {
    async up() {
        await connectDB();

        await osirisActionPort.createIndexes();
        await osirisRequestPort.createIndexes();
    },
};
