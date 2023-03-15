// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: demarchesSimplifieesDataRepository
} = require("../build/src/modules/providers/demarchesSimplifiees/repositories/demarchesSimplifieesData.repository");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: demarchesSimplifieesMapperRepository
} = require("../build/src/modules/providers/demarchesSimplifiees/repositories/demarchesSimplifieesMapper.repository");
module.exports = {
    async up(db, client) {
        await connectDB();

        await demarchesSimplifieesDataRepository.createIndexes();
        await demarchesSimplifieesMapperRepository.createIndexes();
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
