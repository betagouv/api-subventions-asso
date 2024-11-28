const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: osirisActionRepository,
} = require("../build/src/dataProviders/db/providers/osiris/osiris.action.port");
const {
    default: osirisRequestRepository,
} = require("../build/src/dataProviders/db/providers/osiris/osiris.request.port");

module.exports = {
    async up() {
        await connectDB();

        await osirisActionRepository.createIndexes();
        await osirisRequestRepository.createIndexes();
    },

    async down() {
        // No empty function
    },
};
