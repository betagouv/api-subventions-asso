const { default: fonjepService } = require("../build/src/modules/providers/fonjep/fonjep.service");
const { default: fonjepJoiner } = require("../build/src/modules/providers/fonjep/joiners/fonjepJoiner");

module.exports = {
    async up(db) {
        const fullGrants = await fonjepJoiner.getAllFullGrants();

        const versementsGroupByFinanceurCode = fullGrants.reduce((acc, curr) => {
            const financeurCode = curr.data.Dispositif.FinanceurCode;
            if (!acc[financeurCode]) acc[financeurCode] = curr.payments;
            else acc[financeurCode].push(...curr.payments);
            return acc;
        }, {});

        for (const [versements, code] of versementsGroupByFinanceurCode) {
            const bop = fonjepService.getBopFromFounderCode(code);
            console.log(`start update versements with bop ${bop}`);
            await db
                .collection("fonjepVersement")
                .updateMany(
                    { _id: { $in: versements.map(versement => versement._id) } },
                    { $set: { "indexedInformations.bop": bop } },
                );
            console.log(`end update versements with bop ${bop}`);
        }

        throw new Error("end mig");
    },
};
