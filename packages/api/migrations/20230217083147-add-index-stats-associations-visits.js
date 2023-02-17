// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require("../build/src/shared/MongoConnection");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
    default: statsAssociationsVisitRepository
} = require("../build/src/modules/stats/repositories/statsAssociationsVisit.repository");

module.exports = {
    async up(db, client) {
        await connectDB();

        await statsAssociationsVisitRepository.createIndexes();
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
