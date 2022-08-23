/* eslint-disable @typescript-eslint/no-var-requires */
const { connectDB } = require('../build/src/shared/MongoConnection');


module.exports = {
  async up(db, client) {
    await connectDB();
    await db.getCollection('chorus-line').createIndex({ "indexedInformations.siret": 1 });
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },
  
  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
