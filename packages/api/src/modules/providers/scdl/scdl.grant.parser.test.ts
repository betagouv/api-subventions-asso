import ScdlGrantParser from "./scdl.grant.parser";
import MiscScdlGrant from "./__fixtures__/MiscScdlGrant";
import * as Validators from "../../../shared/Validators";
import csvSyncParser from "csv-parse/sync";

jest.mock("../../../shared/Validators");
const mockedValidators = jest.mocked(Validators);
import * as DateHelper from "../../../shared/helpers/DateHelper";

jest.mock("../../../shared/helpers/DateHelper");
const mockedDateHelper = jest.mocked(DateHelper);
import { SCDL_STORABLE } from "./__fixtures__/RawData";
import Siret from "../../../identifierObjects/Siret";
import Rna from "../../../identifierObjects/Rna";
import { GenericParser } from "../../../shared/GenericParser";
import { FormatProblem } from "./@types/Validation";
import { DefaultObject, ParserInfo, ParserPath } from "../../../@types";
import { ScdlParsedGrant } from "./@types/ScdlParsedGrant";

jest.mock("../../../shared/GenericParser");
jest.mock("csv-parse/sync");
const mockedCsvLib = jest.mocked(csvSyncParser);

jest.mock("./scdl.mapper", () => {
    const actual = jest.requireActual("./scdl.mapper");
    const mockedMapper = {};
    for (const key of Object.keys(actual.SCDL_MAPPER)) {
        mockedMapper[key] = actual.SCDL_MAPPER[key];
        if (mockedMapper[key].adapter) mockedMapper[key] = jest.fn(v => v);
    }
    return { SCDL_MAPPER: mockedMapper };
});

describe("ScdlGrantParser", () => {
    const BUFFER = Buffer.alloc(1);
    let isSiretSpy: jest.SpyInstance;
    const isRnaSpy: jest.SpyInstance = jest.spyOn(Rna, "isRna");

    let GRANT: ScdlParsedGrant = { ...MiscScdlGrant };
    const requirementTestsMocks: { [key: string]: jest.SpyInstance } = {};

    beforeAll(() => {
        isSiretSpy = jest.spyOn(Siret, "isSiret");
        // @ts-expect-error -- mock tests
        ScdlGrantParser.requirements.forEach(req => {
            const spy = jest.fn(() => true);
            req.test = spy;
            requirementTestsMocks[req.key] = spy;
        });
    });

    beforeEach(() => {
        GRANT = { ...MiscScdlGrant };
    });

    describe("parseExcel", () => {
        const HEADERS = ["a", "b", "c"];
        const DATA = [
            [1, 2, 3],
            [4, 5, 6],
        ];
        const SHEET = [HEADERS, ...DATA];
        let validateSpy: jest.SpyInstance;
        let duplicateSpy: jest.SpyInstance;

        beforeEach(() => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockReturnValue([{ data: SHEET, name: "whateverName" }]);
            validateSpy = jest
                // @ts-expect-error: mock private method
                .spyOn(ScdlGrantParser, "convertValidateData")
                // @ts-expect-error: mock return value
                .mockReturnValue({ entities: [], problems: [] });
            duplicateSpy = jest
                // @ts-expect-error: mock private method
                .spyOn(ScdlGrantParser, "findDuplicates")
                // @ts-expect-error: mock return value
                .mockReturnValue([]);
        });

        afterAll(() => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockRestore();
            validateSpy.mockRestore();
            duplicateSpy.mockRestore();
        });

        it("parses excel with page names", () => {
            ScdlGrantParser.parseExcel(BUFFER);
            expect(GenericParser.xlsParseWithPageName).toHaveBeenCalledWith(BUFFER);
        });

        it("throws if empty page", () => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockReturnValueOnce([{ data: [], name: "first" }]);
            expect(() => ScdlGrantParser.parseExcel(BUFFER)).toThrowErrorMatchingInlineSnapshot(
                `"no data in required page (default is first page)"`,
            );
        });

        it("reads proper page", () => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockReturnValueOnce([
                { data: [], name: "first" },
                {
                    data: SHEET,
                    name: "specificName",
                },
            ]);
            ScdlGrantParser.parseExcel(BUFFER, "specificName");
            expect(GenericParser.linkHeaderToData).toHaveBeenCalled();
        });

        it("reads default page: first page", () => {
            ScdlGrantParser.parseExcel(BUFFER);
            expect(GenericParser.linkHeaderToData).toHaveBeenCalled();
        });

        it("applies offset", () => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockReturnValueOnce([
                {
                    data: [[], [], ...SHEET],
                    name: "whateverName",
                },
            ]);
            ScdlGrantParser.parseExcel(BUFFER, undefined, 2);
            expect(GenericParser.linkHeaderToData).toHaveBeenCalledWith(HEADERS, DATA[0]);
            expect(GenericParser.linkHeaderToData).toHaveBeenCalledWith(HEADERS, DATA[1]);
        });

        it("filters valid grants", () => {
            jest.mocked(GenericParser.linkHeaderToData).mockReturnValue("TOTO" as unknown as Record<string, unknown>);
            ScdlGrantParser.parseExcel(BUFFER);
            expect(validateSpy).toHaveBeenCalledWith(["TOTO", "TOTO"]);
            jest.mocked(GenericParser.linkHeaderToData).mockReset();
        });
    });

    describe("parseCsv", () => {
        let validateSpy: jest.SpyInstance;
        let duplicateSpy: jest.SpyInstance;

        beforeEach(() => {
            mockedCsvLib.parse.mockReturnValue(SCDL_STORABLE);
            validateSpy = jest
                // @ts-expect-error: mock private method
                .spyOn(ScdlGrantParser, "convertValidateData")
                // @ts-expect-error: mock return value
                .mockReturnValue({ entities: [], problems: [] });
            // @ts-expect-error: mock return value
            duplicateSpy = jest.spyOn(ScdlGrantParser, "findDuplicates").mockReturnValue([]);
        });

        afterAll(() => {
            validateSpy.mockRestore();
            duplicateSpy.mockRestore();
        });

        it("should call csv lib parse", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(mockedCsvLib.parse).toHaveBeenCalledWith(BUFFER, {
                columns: expect.any(Function),
                delimiter: ";",
                skip_empty_lines: true,
                trim: true,
                cast: false,
                quote: '"',
                bom: true,
            });
        });

        it("should call csv lib parse with alternative args", () => {
            ScdlGrantParser.parseCsv(BUFFER, ":", false);
            expect(mockedCsvLib.parse).toHaveBeenCalledWith(BUFFER, {
                columns: expect.any(Function),
                delimiter: ":",
                skip_empty_lines: true,
                trim: true,
                cast: false,
                quote: false,
                bom: true,
            });
        });

        it("should apply header callback and trim column headers", () => {
            const mockParse = jest.fn();
            csvSyncParser.parse = mockParse;

            ScdlGrantParser.parseCsv(BUFFER);

            expect(mockParse).toHaveBeenCalledWith(
                BUFFER,
                expect.objectContaining({
                    columns: expect.any(Function),
                    skip_empty_lines: true,
                    delimiter: ";",
                    trim: true,
                    cast: false,
                    quote: '"',
                    bom: true,
                }),
            );

            const firstCallArguments = mockParse.mock.calls[0];
            const optionsParam = firstCallArguments[1];
            const columnsFunction = optionsParam.columns;

            // use cases
            const headers = ["  nomAttribuant  ", "objet\n"];
            const trimmedHeaders = columnsFunction(headers);

            expect(trimmedHeaders).toEqual(["nomAttribuant", "objet"]);
        });

        it("calls validation with parsed data", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(validateSpy).toHaveBeenCalledWith(SCDL_STORABLE);
        });
    });

    describe("isGrantValid", () => {
        const ORIGINAL_WITH_PATH = {
            allocatorName: { value: "allocatorName-value", keyPath: ["allocatorName-origin"] },
            allocatorSiret: { value: "allocatorSiret-value", keyPath: ["allocatorSiret-origin"] },
            exercice: { value: "exercice-value", keyPath: ["exercice-origin"] },
            conventionDate: { value: "conventionDate-value", keyPath: ["conventionDate-origin"] },
            decisionReference: { value: "decisionReference-value", keyPath: ["decisionReference-origin"] },
            associationName: { value: "associationName-value", keyPath: ["associationName-origin"] },
            associationSiret: { value: "associationSiret-value", keyPath: ["associationSiret-origin"] },
            associationRna: { value: "associationRna-value", keyPath: ["associationRna-origin"] },
            object: { value: "object-value", keyPath: ["object-origin"] },
            amount: { value: "amount-value", keyPath: ["amount-origin"] },
            paymentNature: { value: "paymentNature-value", keyPath: ["paymentNature-origin"] },
            paymentConditions: { value: "paymentConditions-value", keyPath: ["paymentConditions-origin"] },
            paymentStartDate: { value: "paymentStartDate-value", keyPath: ["paymentStartDate-origin"] },
            paymentEndDate: { value: "paymentEndDate-value", keyPath: ["paymentEndDate-origin"] },
            idRAE: { value: "idRAE-value", keyPath: ["idRAE-origin"] },
            UeNotification: { value: "UeNotification-value", keyPath: ["UeNotification-origin"] },
            grantPercentage: { value: "grantPercentage-value", keyPath: ["grantPercentage-origin"] },
            aidSystem: { value: "aidSystem-value", keyPath: ["aidSystem-origin"] },
        };

        beforeEach(() => {
            mockedDateHelper.isValidDate.mockReturnValue(true);
            mockedValidators.isNumberValid.mockReturnValue(true);
        });

        it("should return true with a well formatted grant", () => {
            const expected = { valid: true };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT, ORIGINAL_WITH_PATH);
            expect(actual).toEqual(expected);
        });

        it("should return false and report error if siret not valid", () => {
            requirementTestsMocks.associationSiret.mockReturnValueOnce(false);
            const expected = {
                valid: false,
                problems: [
                    {
                        colonne: "associationSiret-origin",
                        valeur: "associationSiret-value",
                        message: "SIRET du bénéficiaire manquant ou invalide",
                    },
                ],
            };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT, ORIGINAL_WITH_PATH);
            expect(actual).toEqual(expected);
        });

        it("should return false and report error if exercise is defined but not valid", () => {
            requirementTestsMocks.exercice.mockReturnValueOnce(false);
            const expected = {
                valid: false,
                problems: [
                    {
                        colonne: "exercice-origin",
                        valeur: "exercice-value",
                        message: "L'exercice n'est pas un nombre",
                    },
                ],
            };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT, ORIGINAL_WITH_PATH);
            expect(actual).toEqual(expected);
        });

        it("should return true and report error if optional field paymentStartDate is set but not valid", () => {
            requirementTestsMocks.paymentStartDate.mockReturnValueOnce(false);
            const expected = {
                valid: true,
                problems: [
                    {
                        colonne: "paymentStartDate-origin",
                        valeur: "paymentStartDate-value",
                        message: "La date de début de paiement est absente ou non valide",
                    },
                ],
            };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT, ORIGINAL_WITH_PATH);
            expect(actual).toEqual(expected);
        });

        it("should return true and report error if optional allocatorSiret is set but not valid", () => {
            requirementTestsMocks.allocatorSiret.mockReturnValueOnce(false);
            const expected = {
                valid: true,
                problems: [
                    {
                        colonne: "allocatorSiret-origin",
                        valeur: "allocatorSiret-value",
                        message: "SIRET de l'attribuant manquant ou invalide",
                    },
                ],
            };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT, ORIGINAL_WITH_PATH);
            expect(actual).toEqual(expected);
        });

        it("should return false with explanation for each field with error", () => {
            requirementTestsMocks.amount.mockReturnValueOnce(false);
            requirementTestsMocks.paymentStartDate.mockReturnValueOnce(false);
            const expected = {
                valid: false,
                problems: [
                    {
                        colonne: "amount-origin",
                        valeur: "amount-value",
                        message: "Le montant n'est pas un nombre",
                    },
                    {
                        colonne: "paymentStartDate-origin",
                        valeur: "paymentStartDate-value",
                        message: "La date de début de paiement est absente ou non valide",
                    },
                ],
            };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.isGrantValid(GRANT, ORIGINAL_WITH_PATH);
            expect(actual).toEqual(expected);
        });
    });

    describe("cleanOptionalFields", () => {
        it.each`
            param                 | mockValidator                   | nbFalseMock
            ${"paymentStartDate"} | ${mockedDateHelper.isValidDate} | ${0}
            ${"conventionDate"}   | ${mockedDateHelper.isValidDate} | ${1}
            ${"associationRna"}   | ${isRnaSpy}                     | ${1}
            ${"paymentEndDate"}   | ${mockedDateHelper.isValidDate} | ${2}
            ${"allocatorSiret"}   | ${isSiretSpy}                   | ${0}
        `("it sets '$param' to undefined if set but invalid", ({ param, mockValidator, nbFalseMock }) => {
            requirementTestsMocks[param].mockReturnValueOnce(false);
            // mock validators to get to the optionnal part of isGrantValid()
            isSiretSpy.mockReturnValueOnce(true);
            mockedDateHelper.isValidDate.mockReturnValueOnce(true);
            mockedValidators.isNumberValid.mockReturnValueOnce(true);
            mockedValidators.isNumberValid.mockReturnValueOnce(true);

            for (let i = 0; i < nbFalseMock; i++) mockValidator.mockReturnValueOnce(false);

            const expected = { [param]: undefined };
            // @ts-expect-error: protected method
            const actual = ScdlGrantParser.cleanOptionalFields(GRANT);
            expect(actual).toMatchObject(expected);
        });
    });

    describe("convertValidateData", () => {
        let isValidSpy: jest.SpyInstance;
        let indexAnnotateSpy: jest.SpyInstance;
        let cleanupSpy: jest.SpyInstance;
        let verifyMissingHeadersSpy: jest.SpyInstance;

        beforeAll(() => {
            const annotations = {};
            for (const key of Object.keys(GRANT)) {
                annotations[key] = { keyPath: [key], value: GRANT[key] };
            }
            verifyMissingHeadersSpy = jest.spyOn(ScdlGrantParser, "verifyMissingHeaders").mockReturnValue(undefined);
            // @ts-expect-error -- protected method
            isValidSpy = jest.spyOn(ScdlGrantParser, "isGrantValid").mockReturnValue({ valid: true });
            indexAnnotateSpy = jest
                .spyOn(ScdlGrantParser, "indexDataByPathAndAnnotate")
                .mockImplementation((path, v) => ({
                    entity: v,
                    annotations,
                    errors: [],
                }));
            // @ts-expect-error -- protected method
            cleanupSpy = jest.spyOn(ScdlGrantParser, "cleanOptionalFields").mockImplementation(v => v);
            const NOW = new Date("2025-01-16");
            jest.useFakeTimers().setSystemTime(NOW);
        });

        afterAll(() => {
            verifyMissingHeadersSpy.mockRestore();
            isValidSpy.mockRestore();
            cleanupSpy.mockRestore();
            indexAnnotateSpy.mockRestore();
            jest.useRealTimers();
        });

        it("should return storableChunk", () => {
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).entities;
            expect(actual).toMatchSnapshot();
        });

        it("returns only valid entities", () => {
            isValidSpy.mockReturnValueOnce(false);
            const expected = SCDL_STORABLE.length - 1;
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).entities.length;
            expect(actual).toBe(expected);
        });

        it("also returns errors", () => {
            const pb: FormatProblem = { colonne: "something", valeur: "something", message: "clarify problem" };
            isValidSpy.mockReturnValueOnce({ valid: false, problems: [pb] });
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).problems;
            expect(actual).toMatchSnapshot();
        });

        it("also returns errors with problems in optional field so valid result", () => {
            const pb: FormatProblem = { colonne: "something", valeur: "something", message: "clarify problem" };
            isValidSpy.mockReturnValueOnce({ valid: true, problems: [pb] });
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).problems;
            expect(actual).toMatchSnapshot();
        });

        it("saves cleaned up optional fields ", () => {
            cleanupSpy.mockReturnValue({ value: "clean" });
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).entities;
            expect(actual).toMatchSnapshot();
            cleanupSpy.mockRestore();
        });
    });

    describe("indexDataByPathAndAnnotate", () => {
        const ADAPTER_SPY = jest.fn((v: string | undefined): string | null => (v || "") + "--adapted");
        const MAPPER: DefaultObject<ParserPath | ParserInfo> = {
            someField: ["some"],
            otherField: {
                path: ["other"],
            },
            fieldWithAdapter: {
                path: ["path", "needs", "adapting"],
                adapter: ADAPTER_SPY,
            },
        };
        const DATA = {
            some: "someValue",
            other: "otherValue",
            path: { needs: { adapting: "value-needs-adapting" } },
        };

        beforeEach(() => {
            jest.mocked(GenericParser.findValueAndOriginalKeyByPath).mockReturnValueOnce({
                value: "someValue",
                keyPath: ["some"],
            });
            jest.mocked(GenericParser.findValueAndOriginalKeyByPath).mockReturnValueOnce({
                value: "otherValue",
                keyPath: ["other"],
            });
            jest.mocked(GenericParser.findValueAndOriginalKeyByPath).mockReturnValueOnce({
                value: "value-needs-adapting",
                keyPath: ["path", "needs", "adapting"],
            });
        });

        it("finds value and metadata for each field", () => {
            ScdlGrantParser.indexDataByPathAndAnnotate(MAPPER, DATA);
            expect(GenericParser.findValueAndOriginalKeyByPath).toHaveBeenCalledWith(DATA, MAPPER.someField);
            expect(GenericParser.findValueAndOriginalKeyByPath).toHaveBeenCalledWith(DATA, MAPPER.otherField);
            expect(GenericParser.findValueAndOriginalKeyByPath).toHaveBeenCalledWith(DATA, MAPPER.fieldWithAdapter);
        });

        it("pushes error if adapters loses data", () => {
            ADAPTER_SPY.mockReturnValueOnce(null);
            const actual = ScdlGrantParser.indexDataByPathAndAnnotate(MAPPER, DATA).errors;
            expect(actual).toMatchSnapshot();
        });

        it("returns adapted data", () => {
            const actual = ScdlGrantParser.indexDataByPathAndAnnotate(MAPPER, DATA).entity;
            expect(actual).toMatchInlineSnapshot(`
                {
                  "fieldWithAdapter": "value-needs-adapting--adapted",
                  "otherField": "otherValue",
                  "someField": "someValue",
                }
            `);
        });

        it("returns annotations", () => {
            const actual = ScdlGrantParser.indexDataByPathAndAnnotate(MAPPER, DATA).annotations;
            expect(actual).toMatchInlineSnapshot(`
                {
                  "fieldWithAdapter": {
                    "keyPath": [
                      "path",
                      "needs",
                      "adapting",
                    ],
                    "value": "value-needs-adapting",
                  },
                  "otherField": {
                    "keyPath": [
                      "other",
                    ],
                    "value": "otherValue",
                  },
                  "someField": {
                    "keyPath": [
                      "some",
                    ],
                    "value": "someValue",
                  },
                }
            `);
        });
    });

    describe("findDuplicates", () => {
        // add two duplicates
        const PARSED_CHUNK = [...SCDL_STORABLE, SCDL_STORABLE[0], SCDL_STORABLE[1]];

        it("should return duplicates", () => {
            const expected = [
                { ...SCDL_STORABLE[0], doublon: "oui", bloquant: "oui" },
                { ...SCDL_STORABLE[1], doublon: "oui", bloquant: "oui" },
            ];
            // @ts-expect-error: test private method
            const actual = ScdlGrantParser.findDuplicates(PARSED_CHUNK);
            expect(actual).toEqual(expected);
        });

        it("return empty array if no duplicate found", () => {
            const expected = [];
            // @ts-expect-error: test private method
            const actual = ScdlGrantParser.findDuplicates(SCDL_STORABLE);
            expect(actual).toEqual(expected);
        });
    });
});
