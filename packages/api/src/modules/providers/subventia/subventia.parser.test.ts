// describe > ecrire block : on peut mettre plusieurs describe
// it > à l'interieur de describe qui permets de faire plusiseurs tests
// expect, actuel expected
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import SubventiaParser from "./subventia.parser";

// Qu'est-ce qu'on souhaite la réference administrative de la demande est nulle ?
// une des données undefined ce n'est pas possible
// et si la valeur du montant est string et pas nulle ? Où est-ce que vous faites cette analyse ?

describe("SubventiaParser", () => {
    const application = {
        "Financeur Principal": "SGCIPDR",
        "SIRET - Demandeur": "77568879901340",
        annee_demande: 2023,
        "Date - Décision": 45042.604166666664,
        "Date limite de début de réalisation": "",
        "Date limite de fin de réalisation": "",
        "Date - Visa de recevabilité": "",
        "Montant voté TTC - Décision": "",
        "Montant Ttc": 31164,
        "Dispositif - Dossier de financement": "",
        "Thematique Title": "Prévention de la délinquance - destinée aux 12-25 ans",
        "Eligible? - Dossier de financement": true,
        "Statut - Dossier de financement": "",
        "Référence administrative - Demande": "00007418",
    };

    /*
    const data = [
        [100, "ref1"],
        [200, "ref2"],
        [300, "ref1"],
    ];
    const headers = ["Montant Ttc", "Référence administrative - Demande"];
    */

    const ref1_value1 = { "Montant Ttc": 100, "Référence administrative - Demande": "ref1" };
    const ref1_value2 = { "Montant Ttc": 300, "Référence administrative - Demande": "ref1" };

    const ref2_value1 = { "Montant Ttc": 200, "Référence administrative - Demande": "ref2" };

    const refNull_value1 = { "Montant Ttc": 400, "Référence administrative - Demande": null };
    const refNull_value2 = { "Montant Ttc": 5000, "Référence administrative - Demande": null };

    const parsedData = [ref1_value1, ref2_value1, ref1_value2];

    const parsedDataWithAmountNull = [
        ref1_value1,
        ref2_value1,
        { "Montant Ttc": null, "Référence administrative - Demande": "ref2" },
        ref1_value2,
    ];

    const parsedDataWithRefsNull = [ref1_value1, ref2_value1, refNull_value1, refNull_value2, ref1_value2];

    describe("mergeToApplication", () => {
        it("should return the sum of the amount", () => {
            const applicationLines = [
                ref1_value1,
                { "Montant Ttc": 200, "Référence administrative - Demande": "ref1" },
                ref1_value2,
            ];
            const expected = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" };
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });

        it("should return the sum of the amount considering null values as zeros", () => {
            const applicationLines = [
                { "Montant Ttc": null, "Référence administrative - Demande": "ref1" },
                ref1_value1,
                ref1_value2,
            ];
            const expected = { "Montant Ttc": 400, "Référence administrative - Demande": "ref1" };
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });

        it("should return the sum of the amount for ref null", () => {
            const applicationLines = [refNull_value1, refNull_value2];
            const expected = { "Montant Ttc": 5400, "Référence administrative - Demande": null };
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });
    });

    describe("groupByApplication", () => {
        it("should group by Référence administrative - Demande", () => {
            const expected = {
                ref1: [ref1_value1, ref1_value2],
                ref2: [ref2_value1],
            };
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.groupByApplication(parsedData);
            expect(actual).toEqual(expected);
        });

        it("should group by Référence administrative - Demande", () => {
            const expected = {
                ref1: [ref1_value1, ref1_value2],
                ref2: [ref2_value1],
                null: [refNull_value1, refNull_value2],
            };
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.groupByApplication(parsedDataWithRefsNull);
            expect(actual).toEqual(expected);
        });
    });

    /*
    describe("getApplications", () => {
        it("should return the sum of the amount by Référence administative - Demande", () => {
            const expected = [
                { "Montant Ttc": 400, "Référence administrative - Demande": "ref1" },
                ref2_value1,
            ];
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.getApplications(parsedData);
            expect(actual).toEqual(expected);
        });

        it("should return the sum of the amount by Référence administative - Demande considering nulls as zero", () => {
            const expected = [
                { "Montant Ttc": 400, "Référence administrative - Demande": "ref1" },
                ref2_value1,
            ];
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.getApplications(parsedDataWithAmountNull);
            expect(actual).toEqual(expected);
        });
    });
    */
});
