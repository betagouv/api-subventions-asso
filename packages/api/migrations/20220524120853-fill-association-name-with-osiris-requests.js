const { default: osirisPort } = require("../build/src/dataProviders/db/providers/osiris/osiris.request.port");
const {
    default: associationNameRepository,
} = require("../build/src/modules/association-name/repositories/associationName.repository");
const { connectDB } = require("../build/src/shared/MongoConnection");
const { printAtSameLine } = require("../build/src/shared/helpers/CliHelper");
const { siretToSiren } = require("../build/src/shared/helpers/SirenHelper");

module.exports = {
    async up(db) {
        console.log("Connecting to DB...");
        await connectDB();
        const associationNameCollection = db.collection("association-name");
        const cursor = osirisPort.cursorFindRequests();

        let counter = 0;
        console.log("Starting to fill association-name with osiris requests...");
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (!doc) continue;
            const { name, siret, rna } = { ...doc.legalInformations };
            const siren = siretToSiren(siret);
            const date = doc.providerInformations.dateCommission || doc.providerInformations.exerciceDebut;
            const entity = await associationNameCollection.findOne({ siren: siren });
            if (name && siren && rna && date && !entity) {
                await associationNameRepository.create({
                    siren,
                    rna,
                    name,
                    provider: "OSIRIS",
                    lastUpdate: date,
                });
            }
            counter++;
            printAtSameLine(counter.toString());
        }
        console.log("End of migration!");
    },
};
