import ScdlGrantParser from "./scdl.grant.parser";
import MiscScdlGrant from "./__fixtures__/MiscScdlGrant";
import * as Validators from "../../../shared/Validators";
import csvSyncParser = require("csv-parse/sync");

jest.mock("../../../shared/Validators");
const mockedValidators = jest.mocked(Validators);
import * as DateHelper from "../../../shared/helpers/DateHelper";

jest.mock("../../../shared/helpers/DateHelper");
const mockedDateHelper = jest.mocked(DateHelper);
import { SCDL_STORABLE } from "./__fixtures__/RawData";
import { GenericParser } from "../../../shared/GenericParser";
import { ScdlParsedGrant } from "./@types/ScdlParsedGrant";
import { Problem } from "./@types/Validation";
import { DefaultObject, ParserInfo, ParserPath } from "../../../@types";

jest.mock("../../../shared/GenericParser");
const mockedGenericParser = jest.mocked(GenericParser);
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
    let GRANT: ScdlParsedGrant = { ...MiscScdlGrant };
    const requirementTestsMocks: { [key: string]: jest.SpyInstance } = {};

    beforeAll(() => {
        // @ts-expect-error -- mock tests
        ScdlGrantParser.requirements.forEach(req => {
            const spy = jest.fn(v => true);
            req.test = spy;
            requirementTestsMocks[req.key] = spy;
        });
    });

    beforeEach(() => {
        GRANT = { ...MiscScdlGrant };
    });

    describe("parseCsv", () => {
        let validateSpy: jest.SpyInstance;

        beforeEach(() => {
            mockedCsvLib.parse.mockReturnValue(SCDL_STORABLE);
            // @ts-expect-error -- mock private method
            validateSpy = jest.spyOn(ScdlGrantParser, "convertValidateData").mockImplementation();
        });

        afterAll(() => validateSpy.mockRestore());

        it("should call csv lib parse", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(mockedCsvLib.parse).toHaveBeenCalledWith(BUFFER, {
                columns: true,
                delimiter: ";",
                skip_empty_lines: true,
                trim: true,
                cast: false,
                quote: '"',
            });
        });

        it("should call csv lib parse with alternative args", () => {
            ScdlGrantParser.parseCsv(BUFFER, ":", false);
            expect(mockedCsvLib.parse).toHaveBeenCalledWith(BUFFER, {
                columns: true,
                delimiter: ":",
                skip_empty_lines: true,
                trim: true,
                cast: false,
                quote: false,
            });
        });

        it("calls validation with parsed data", () => {
            ScdlGrantParser.parseCsv(BUFFER);
            expect(validateSpy).toHaveBeenCalledWith(SCDL_STORABLE);
        });
    });

    describe("parseExcel", () => {
        const HEADERS = ["a", "b", "c"];
        const DATA = [
            [1, 2, 3],
            [4, 5, 6],
        ];
        const SHEET = [HEADERS, ...DATA];
        let validateSpy: jest.SpyInstance;

        beforeAll(() => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockReturnValue([{ data: SHEET, name: "whateverName" }]);
            // @ts-expect-error -- mock private method
            validateSpy = jest.spyOn(ScdlGrantParser, "convertValidateData").mockImplementation();
        });

        afterAll(() => {
            jest.mocked(GenericParser.xlsParseWithPageName).mockRestore();
            validateSpy.mockRestore();
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
            // @ts-expect-error -- mock private method
            const spyFilter = jest.spyOn(ScdlGrantParser, "convertValidateData");
            jest.mocked(GenericParser.linkHeaderToData).mockReturnValue("TOTO" as unknown as Record<string, any>);
            ScdlGrantParser.parseExcel(BUFFER);
            expect(spyFilter).toHaveBeenCalledWith(["TOTO", "TOTO"]);
            jest.mocked(GenericParser.linkHeaderToData).mockRestore();
        });
    });

    describe("isGrantValid", () => {
        const ORIGINAL_WITH_PATH = {
            producerSlug: { value: "producerSlug-value", keyPath: ["producerSlug-origin"] },
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

        it("should return true and no errors with a well formatted grant", () => {
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
                        field: "associationSiret-origin",
                        value: "associationSiret-value",
                        message: "SIRET manquant ou invalide",
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
                        field: "exercice-origin",
                        value: "exercice-value",
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
                        field: "paymentStartDate-origin",
                        value: "paymentStartDate-value",
                        message: "La date de début de paiement est définie mais pas valide",
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
                        field: "allocatorSiret-origin",
                        value: "allocatorSiret-value",
                        message: "SIRET invalide",
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
                        field: "amount-origin",
                        value: "amount-value",
                        message: "Le montant n'est pas un nombre",
                    },
                    {
                        field: "paymentStartDate-origin",
                        value: "paymentStartDate-value",
                        message: "La date de début de paiement est définie mais pas valide",
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
            ${"associationRna"}   | ${mockedValidators.isRna}       | ${0}
            ${"paymentEndDate"}   | ${mockedDateHelper.isValidDate} | ${2}
            ${"allocatorSiret"}   | ${mockedValidators.isSiret}     | ${0}
        `("it sets '$param' to undefined if set but invalid", ({ param }) => {
            requirementTestsMocks[param].mockReturnValueOnce(false);
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

        beforeAll(() => {
            const annotations = {};
            for (const key of Object.keys(GRANT)) {
                annotations[key] = { keyPath: [key], value: GRANT[key] };
            }
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
        });

        afterAll(() => {
            isValidSpy.mockRestore();
            cleanupSpy.mockRestore();
            indexAnnotateSpy.mockRestore();
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
            const pb: Problem = { field: "something", value: "something", message: "clarify problem" };
            isValidSpy.mockReturnValueOnce({ valid: false, problems: [pb] });
            const expected = SCDL_STORABLE.length - 1;
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).errors;
            expect(actual).toMatchSnapshot();
        });

        it("also returns errors with problems in optional field so valid result", () => {
            const pb: Problem = { field: "something", value: "something", message: "clarify problem" };
            isValidSpy.mockReturnValueOnce({ valid: true, problems: [pb] });
            const expected = SCDL_STORABLE.length - 1;
            // @ts-expect-error -- mock private method
            const actual = ScdlGrantParser.convertValidateData(SCDL_STORABLE).errors;
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
            expect(actual).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "field": "path.needs.adapting",
                    "message": "donnée non récupérable",
                    "other": "otherValue",
                    "path": Object {
                      "needs": Object {
                        "adapting": "value-needs-adapting",
                      },
                    },
                    "some": "someValue",
                    "value": "value-needs-adapting",
                  },
                ]
            `);
        });

        it("returns adapted data", () => {
            const actual = ScdlGrantParser.indexDataByPathAndAnnotate(MAPPER, DATA).entity;
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "fieldWithAdapter": "value-needs-adapting--adapted",
                  "otherField": "otherValue",
                  "someField": "someValue",
                }
            `);
        });

        it("returns annotations", () => {
            const actual = ScdlGrantParser.indexDataByPathAndAnnotate(MAPPER, DATA).annotations;
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "fieldWithAdapter": Object {
                    "keyPath": Array [
                      "path",
                      "needs",
                      "adapting",
                    ],
                    "value": "value-needs-adapting",
                  },
                  "otherField": Object {
                    "keyPath": Array [
                      "other",
                    ],
                    "value": "otherValue",
                  },
                  "someField": Object {
                    "keyPath": Array [
                      "some",
                    ],
                    "value": "someValue",
                  },
                }
            `);
        });
    });
});
