module.exports = {
    async up(db) {
        const cursor = await db.collection("chorus-line").aggregate([
            { $match: {} },
            {
                $project: {
                    _id: 1,
                    uniqueId: 1,
                    updateDate: 1,
                    ej: "$indexedInformations.ej",
                    numPosteEJ: "$indexedInformations.numPosteEJ",
                    siret: "$indexedInformations.siret",
                    ridetOrTahitiet: "$data.No TVA 3 (COM-RIDET ou TAHITI)",
                    codeBranche: "$indexedInformations.codeBranche",
                    branche: "$indexedInformations.branche",
                    activitee: "$indexedInformations.activitee",
                    codeActivitee: "$indexedInformations.codeActivitee",
                    numeroDemandePaiement: "$indexedInformations.numeroDemandePaiement",
                    numPosteDP: "$indexedInformations.numPosteDP",
                    codeSociete: "$indexedInformations.codeSociete",
                    exercice: "$indexedInformations.exercice",
                    numeroTier: "$indexedInformations.numeroTier",
                    nomStructure: "$data.Fournisseur payé (DP)",
                    centreFinancier: "$indexedInformations.centreFinancier",
                    codeCentreFinancier: "$indexedInformations.codeCentreFinancier",
                    domaineFonctionnel: "$indexedInformations.domaineFonctionnel",
                    codeDomaineFonctionnel: "$indexedInformations.codeDomaineFonctionnel",
                    amount: "$indexedInformations.amount",
                    dateOperation: "$indexedInformations.dateOperation",
                },
            },
            { $out: "chorus" },
        ]);

        for await (const _document of cursor) {
            console.log("flatten indexed informations...");
        }
    },
};
