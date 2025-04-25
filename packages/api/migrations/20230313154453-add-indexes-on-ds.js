const { connectDB } = require("../build/src/shared/MongoConnection");
const {
    default: demarchesSimplifieesDataPort,
} = require("../build/src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port");
const {
    default: demarchesSimplifieesMapperPort,
} = require("../build/src/dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesMapper.port");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        await connectDB();

        await demarchesSimplifieesDataPort.createIndexes();
        await demarchesSimplifieesMapperPort.createIndexes();
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
