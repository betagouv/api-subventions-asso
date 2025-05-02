const { connectDB } = require("../build/src/shared/MongoConnection");
const dataGouvService = require("../build/src/modules/providers/datagouv/datagouv.service").default;

module.exports = {
    async up(db) {
        await connectDB();

        const collection = db.collection("association-name");
        console.log(dataGouvService.provider.name);

        await collection.updateMany(
            {
                provider: "Base Sirene des entreprises et de leurs établissements (data.gouv.fr)",
            },
            { $set: { provider: dataGouvService.provider.name } },
        );
    },
};
