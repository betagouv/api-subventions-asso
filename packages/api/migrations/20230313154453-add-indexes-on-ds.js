/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: demarchesSimplifieesDataRepository,
} = require("../build/src/modules/providers/demarchesSimplifiees/repositories/demarchesSimplifieesData.repository");
const {
    default: demarchesSimplifieesMapperRepository,
} = require("../build/src/modules/providers/demarchesSimplifiees/repositories/demarchesSimplifieesMapper.repository");
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();

        await demarchesSimplifieesDataRepository.createIndexes();
        await demarchesSimplifieesMapperRepository.createIndexes();
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
