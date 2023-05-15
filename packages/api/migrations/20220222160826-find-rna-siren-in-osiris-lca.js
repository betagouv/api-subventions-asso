const rnaSirenService = require("../build/src/modules/open-data/rna-siren/rnaSiren.service").default;
const { connectDB } = require("../build/src/shared/MongoConnection");
const { printProgress } = require("../build/src/shared/helpers/CliHelper");

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async up(db, client) {
        console.log("Start RNA-SIREN migration");
        await connectDB();
        const rnaSiren = (
            await Promise.all(
                [db.collection("osiris-requests"), db.collection("lecompteasso-requests")].map(async collection => {
                    const data = await collection.find({}).toArray();
                    return data.map(request => ({
                        rna: request.legalInformations.rna,
                        siret: request.legalInformations.siret,
                    }));
                }),
            )
        ).flat();

        console.log(`${rnaSiren.length} founds. Start register`);

        return rnaSiren.reduce(async (acc, data, index) => {
            await acc;
            printProgress(index + 1, rnaSiren.length);
            return rnaSirenService.add(data.rna, data.siret);
        }, Promise.resolve(null));
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
