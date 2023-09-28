const { default: fonjepService } = require("../build/src/modules/providers/fonjep/fonjep.service");

module.exports = {
    async up(db, client) {
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:

        const cursor = await db.collection("fonjepVersement").find({});

        while (await cursor.hasNext()) {
            const versement = await cursor.next();
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
        }
    },

    async down(db, client) {
        // TODO write the statements to rollback your migration (if possible)
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    },
};
