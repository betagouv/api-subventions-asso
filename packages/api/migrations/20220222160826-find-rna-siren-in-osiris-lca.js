// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnaSirenService = require("../build/src/modules/rna-siren/rnaSiren.service").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectDB } = require('../build/src/shared/MongoConnection');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { printProgress } = require("../build/src/shared/helpers/CliHelper");

module.exports = {
    async up(db, client) {
        console.log("Start RNA-SIREN migration")
        await connectDB();
        const rnaSiren = (await Promise.all([db.collection("osiris-requests"), db.collection("lecompteasso-requests")].map(async collection => {
            const data = await collection.find({}).toArray();
            return data.map(request => ({rna: request.legalInformations.rna, siret: request.legalInformations.siret}))
        }))).flat();

        console.log(`${rnaSiren.length} founds. Start register`);

        return rnaSiren.reduce( async (acc, data, index) => {
            await acc;
            printProgress(index +1, rnaSiren.length);
            return rnaSirenService.add(data.rna, data.siret)
        }, Promise.resolve(null));
    },

    async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    }
};
