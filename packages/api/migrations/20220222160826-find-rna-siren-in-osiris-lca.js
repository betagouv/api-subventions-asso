const rnaSirenService = require("../build/src/_modules/open-data/rna-siren/rnaSiren.service").default;
const { connectDB } = require("../build/src/shared/MongoConnection");
const { printProgress } = require("../build/src/shared/helpers/CliHelper");

module.exports = {
    async up(db) {
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
};
