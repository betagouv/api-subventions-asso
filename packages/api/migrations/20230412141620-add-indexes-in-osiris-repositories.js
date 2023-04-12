// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: osirisActionRepository
} = require("../build/src/modules/providers/osiris/repositories/osiris.action.repository");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: osirisRequestRepository
} = require("../build/src/modules/providers/osiris/repositories/osiris.request.repository");

module.exports = {
    async up() {
        await connectDB();

        await osirisActionRepository.createIndexes();
        await osirisRequestRepository.createIndexes();
    },

    async down() {
        // No empty function
    }
};
