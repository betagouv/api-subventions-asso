const { default: fonjepService } = require("../build/src/modules/providers/fonjep/fonjep.service");

module.exports = {
    async up(db) {
        const result = await db
            .collection("fonjepSubvention")
            .aggregate([
                { $match: {} },
                {
                    $group: {
                        _id: "$data.Dispositif.FinanceurCode",
                        subs: { $addToSet: "$indexedInformations.code_poste" },
                    },
                },
            ])
            .toArray();

        for (const obj of result) {
            const bop = fonjepService.getBopFromFounderCode(obj._id);
            await db
                .collection("fonjepVersement")
                .updateMany(
                    { "indexedInformations.code_poste": { $in: obj.subs } },
                    { $set: { "indexedInformations.bop": bop } },
                );
        }
    },
};
