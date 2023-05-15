const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: osirisActionRepository,
} = require("../build/src/modules/providers/osiris/repositories/osiris.action.repository");
const {
    default: osirisRequestRepository,
} = require("../build/src/modules/providers/osiris/repositories/osiris.request.repository");

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
