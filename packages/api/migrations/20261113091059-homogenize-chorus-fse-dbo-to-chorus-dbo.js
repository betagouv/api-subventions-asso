module.exports = {
    async up(db) {
        await db
            .collection("chorus-fse")
            .dropIndex("budgetaryYear_1_societyCode_1_paymentRequestPostNum_1_paymentRequestNum_1");

        await db.collection("chorus-fse").updateMany(
            {},
            {
                $rename: {
                    ejPostNum: "numPosteEJ",
                    identifier: "siret",
                    branchCode: "codeBranche",
                    branch: "branche",
                    programRef: "activitee",
                    programRefCode: "codeActivitee",
                    paymentRequestNum: "numeroDemandePaiement",
                    paymentRequestPostNum: "numPosteDP",
                    societyCode: "codeSociete",
                    budgetaryYear: "exercice",
                    paidSupplierId: "numeroTier",
                    beneficiaryName: "nomStructure",
                    financialCenter: "centreFinancier",
                    financialCenterCode: "codeCentreFinancier",
                    functionalDomain: "domaineFonctionnel",
                    functionalDomainCode: "codeDomaineFonctionnel",
                    operationDate: "dateOperation",
                },
                $set: { ridetOrTahitiet: "#" },
            }, // all data were linked to siret so # is fine here
        );

        await db.collection("chorus-fse").createIndex("exercice_1_codeSociete_1_numPosteDP_1_numeroDemandePaiement_1");
    },
};
