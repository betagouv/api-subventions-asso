// describe > ecrire block : on peut mettre plusieurs describe
// it > à l'interieur de describe qui permets de faire plusiseurs tests
// expect, actuel expected
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
import SubventiaParser from "./subventia.parser";

describe("SubventiaParser", () => {
    const data = [
        [100, "ref1"],
        [200, "ref2"],
        [300, "ref1"],
    ];
    const headers = ["Montant Ttc", "Référence administrative - Demande"];
    const parsedData = data.map(row => ParseHelper.linkHeaderToData(headers, row));
    console.log(parsedData);

    describe("mergeToApplication", () => {
        const applicationLines = [
            { "Montant Ttc": 100, "Référence administrative - Demande": "ref1" },
            { "Montant Ttc": 200, "Référence administrative - Demande": "ref1" },
            { "Montant Ttc": 300, "Référence administrative - Demande": "ref1" },
        ];
        it("should return the sum of the amount", () => {
            const expected = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" };
            //@ts-expect-error : test protected method
            const actual = SubventiaParser.mergeToApplication(applicationLines);
            expect(actual).toEqual(expected);
        });
    });
});
