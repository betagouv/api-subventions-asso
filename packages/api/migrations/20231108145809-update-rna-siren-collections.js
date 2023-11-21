const rnaSirenPort = require("../build/src/dataProviders/db/rnaSiren/rnaSiren.port").default;
const { connectDB } = require("../build/src/shared/MongoConnection");
const rnaSirenService = require("../build/src/modules/rna-siren/rnaSiren.service").default;
module.exports = {
  async up(db) {
    await connectDB();
    await db.collection("rna-siren").rename('old_rna-siren');
    
    await rnaSirenPort.createIndexes();
    const cursor = db.collection("old_rna-siren").find();

    while (await cursor.hasNext()) {
      const rnaSiren = await cursor.next();
      await rnaSirenService.insert(rnaSiren.rna, rnaSiren.siren);
    }

    // old_rna-siren will be deleted later
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
