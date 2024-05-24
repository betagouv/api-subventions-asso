// describe > ecrire block : on peut mettre plusieurs describe
// it > à l'interieur de describe qui permets de faire plusiseurs tests
// expect, actuel expected
import fs, { cp } from "fs";
jest.mock("fs"); // mock fs module. tputes methodes return undefined
import SubventiaParser from "./subventia.parser";
import { buffer } from "stream/consumers";
import { after } from "lodash";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";

const BUFFER = Buffer.from("fileContent");
const FILEPATH = "filePath";
describe("SubventiaParser", () => {
    beforeEach(() => {
        jest.mocked(fs.existsSync).mockReturnValue(true);
        jest.mocked(fs.readFileSync).mockReturnValue(BUFFER);
    });

    describe("filePathValidator", () => {
        it("should throw an error if the file is not a string", () => {
            //@ts-expect-error : test private method
            expect(() => SubventiaParser.filePathValidator()).toThrowError("Parse command need file args");
        });

        it("should throw an error if the file does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            //@ts-expect-error : test private method
            expect(() => SubventiaParser.filePathValidator(FILEPATH)).toThrowError("File not found ");
        });

        it("should return true if the file exists", () => {
            //morckReturnValue VS MockResolved for async or mockReturnvlalue Once
            const expected = true;
            //@ts-expect-error : test private method
            const actual = SubventiaParser.filePathValidator(FILEPATH);
            expect(actual).toEqual(expected);
        });
    });

    describe("getBuffer", () => {
        let mockFilePathValidator: jest.Mock;
        beforeEach(() => {
            //@ts-expect-error : test private method
            mockFilePathValidator = jest.spyOn(SubventiaParser, "filePathValidator").mockReturnValue(true);
        });

        afterAll(() => {
            mockFilePathValidator.mockRestore();
        });

        it("should return the buffer of the file", () => {
            const expected = BUFFER;
            //@ts-expect-error : test private method
            const actual = SubventiaParser.getBuffer(FILEPATH);
            expect(actual).toEqual(expected);
        });

        it("should call filePathValidator", () => {
            //@ts-expect-error : test private method
            SubventiaParser.getBuffer(FILEPATH);
            expect(mockFilePathValidator).toHaveBeenCalledWith(FILEPATH);
        });
    });

    describe("parse", () => {
        let mockFilePathValidator: jest.Mock;
        let mockGetBuffer: jest.Mock;
        let mockXlsParse: jest.Mock;

        beforeEach(() => {
            //@ts-expect-error : test private method
            mockFilePathValidator = jest.spyOn(SubventiaParser, "filePathValidator").mockReturnValue(true);
            //@ts-expect-error : test private method
            mockGetBuffer = jest.spyOn(SubventiaParser, "getBuffer").mockReturnValue(BUFFER);
            //@ts-expect-error : test private method
            mockXlsParse = jest.spyOn(ParseHelper, "xlsParse").mockReturnValue([
                [
                    ["header1", "header2"],
                    ["value1", "value2"],
                    ["value3", "value4"],
                ],
            ]);
        });

        afterAll(() => {
            mockFilePathValidator.mockRestore();
            mockGetBuffer.mockRestore();
            mockXlsParse.mockRestore();
        });

        it("should call filePathValidator", () => {
            SubventiaParser.parse("file");
            expect(mockFilePathValidator).toHaveBeenCalledWith("file");
        });

        it("should call getBuffer", () => {
            SubventiaParser.parse("file");
            expect(mockGetBuffer).toHaveBeenCalledWith("file");
        });

        it("should call xlsParse", () => {
            SubventiaParser.parse("file");
            expect(mockXlsParse).toHaveBeenCalledWith(BUFFER);
        });

        it("should return parsed data", () => {
            const expected = [
                { header1: "value1", header2: "value2" },
                { header1: "value3", header2: "value4" },
            ];

            const actual = SubventiaParser.parse("file");
            expect(actual).toEqual(expected);
        });
    });
});

/*
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

    
    const data = [
        [100, "ref1"],
        [200, "ref2"],
        [300, "ref1"],
    ];
    const headers = ["Montant Ttc", "Référence administrative - Demande"];
    

    const ref1_value1 = { "Montant Ttc": 100, "Référence administrative - Demande": "ref1" };
    const ref1_value2 = { "Montant Ttc": 300, "Référence administrative - Demande": "ref1" };

    const ref2_value1 = { "Montant Ttc": 200, "Référence administrative - Demande": "ref2" };

    const refNull_value1 = { "Montant Ttc": 400, "Référence administrative - Demande": null };
    const refNull_value2 = { "Montant Ttc": 5000, "Référence administrative - Demande": null };

    const parsedData = [ref1_value1, ref2_value1, ref1_value2];
// comment je fais si je veux changer que un element de la liste
//  ou que un attribut d'un element de la liste en utilisant un destructuring
// [{...ref1_value1, "Montant Ttc": null }, ]

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
    
});

*/
