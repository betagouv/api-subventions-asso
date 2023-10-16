const { default: fonjepService } = require("../build/src/modules/providers/fonjep/fonjep.service");

module.exports = {
    async up(db) {
        const cursor = await db.collection("fonjepVersement").find({});

        let nbVersementUpdated = 0;
        while (await cursor.hasNext()) {
            const versement = await cursor.next();
            if (versement.indexedInformations.bop) continue;
            const subvention = (
                await db
                    .collection("fonjepSubvention")
                    .find({ "indexedInformations.code_poste": versement.indexedInformations.code_poste })
                    .toArray()
            )[0];
            versement.indexedInformations.bop = fonjepService.getBopFromFounderCode(
                subvention.data["FinanceurPrincipalCode"],
            );
            await db.collection("fonjepVersement").updateOne({ _id: versement._id }, { $set: versement });
            nbVersementUpdated++;
            if (nbVersementUpdated % 100 === 0) console.log(`100 bop ajoutés`);
        }
    },
};
