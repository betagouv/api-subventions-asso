import OsirisParser from "./osiris.parser";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import { OSIRIS_ACTION_ENTITY } from "../../../../tests/modules/providers/osiris/__fixtures__/OsirisEntities";
import { GenericParser } from "../../../shared/GenericParser";
import { DefaultObject } from "../../../@types";
jest.mock("../../../shared/GenericParser");

describe("OsirisParser", () => {
    describe("parseRequests", () => {
        let mockRowToRowWithHeaders: jest.SpyInstance;
        const BUFFER = Buffer.from([]);
        const HEADERS = [
            ["Dossier", "Dossier"],
            ["N° Dossier Osiris", "N° Dossier Compte Asso"],
        ]; // osiris has a two level header
        const ROWS = [
            ["CR-AAAA-23-0001", "23-001234"],
            ["CR-AAAA-24-0002", "24-005678"],
            ["CR-AAAA-25-0003", "25-009101"],
        ]; // mock two rows
        const MAPPED_ROWS: DefaultObject<DefaultObject<string | number>>[] = [
            { Dossier: { "N° Dossier Osiris": ROWS[0][0], "N° Dossier Compte Asso": ROWS[0][1] } },
            { Dossier: { "N° Dossier Osiris": ROWS[1][0], "N° Dossier Compte Asso": ROWS[1][1] } },
            { Dossier: { "N° Dossier Osiris": ROWS[2][0], "N° Dossier Compte Asso": ROWS[2][1] } },
        ]; // expected mapped rows
        const DATA = [...HEADERS, ...ROWS, []]; // mock xls data with footer at the end

        beforeAll(() => {
            jest.spyOn(GenericParser, "xlsxParse").mockReturnValue([{ name: "page1", data: DATA }]); // data wrap in array because first xls page

            let rowCount = 0;
            mockRowToRowWithHeaders = jest
                // @ts-expect-error: mock private method
                .spyOn(OsirisParser, "rowToRowWithHeaders")
                .mockImplementation(() => {
                    const index = rowCount % ROWS.length;
                    rowCount++;
                    return MAPPED_ROWS[index];
                });
        });

        afterAll(() => {
            mockRowToRowWithHeaders.mockRestore();
        });

        it("parses data", () => {
            OsirisParser.parseRequests(BUFFER);
            expect(GenericParser.xlsxParse).toHaveBeenCalledWith(BUFFER);
        });

        it("adds headers to rows", () => {
            OsirisParser.parseRequests(BUFFER);
            ROWS.forEach((row, index) => {
                // @ts-expect-error: assert private mock calls
                expect(OsirisParser.rowToRowWithHeaders).toHaveBeenNthCalledWith(index + 1, HEADERS, row, "Dossier");
            });
        });

        it("returns osiris request dtos", () => {
            const actual = OsirisParser.parseRequests(BUFFER);
            expect(actual).toEqual(MAPPED_ROWS);
        });
    });

    describe("parseActions", () => {
        let mockRowToRowWithHeaders: jest.SpyInstance;

        const BUFFER = Buffer.from([]);
        const HEADERS = [
            ["Dossier/action", "Dossier/action"],
            ["Numero Action Osiris", "N° Dossier Compte Asso"],
        ]; // osiris has a two level header
        const ROWS = [
            ["DD59-23-0123-1", "23-001234"],
            ["DD59-24-0456-1", "24-005678"],
            ["DD59-25-0789-1", "25-009101"],
        ]; // mock two rows
        const MAPPED_ROWS: DefaultObject<DefaultObject<string | number>>[] = [
            { "Dossier/action": { "Numero Action Osiris": ROWS[0][0], "N° Dossier Compte Asso": ROWS[0][1] } },
            { "Dossier/action": { "Numero Action Osiris": ROWS[1][0], "N° Dossier Compte Asso": ROWS[1][1] } },
            { "Dossier/action": { "Numero Action Osiris": ROWS[2][0], "N° Dossier Compte Asso": ROWS[2][1] } },
        ]; // expected mapped rows
        const DATA = [...HEADERS, ...ROWS, []]; // mock xls data with footer at the end
        const INDEXED_INFORMATIONS = OSIRIS_ACTION_ENTITY.indexedInformations;

        beforeAll(() => {
            jest.spyOn(GenericParser, "xlsxParse").mockReturnValue([{ name: "page1", data: DATA }]); // data wrap in array because first xls page
            jest.spyOn(GenericParser, "indexDataByPathObject").mockReturnValue(INDEXED_INFORMATIONS);

            let rowCount = 0;
            mockRowToRowWithHeaders = jest
                // @ts-expect-error: mock private method
                .spyOn(OsirisParser, "rowToRowWithHeaders")
                .mockImplementation(() => {
                    const index = rowCount % ROWS.length;
                    rowCount++;
                    return MAPPED_ROWS[index];
                });
        });

        afterAll(() => {
            mockRowToRowWithHeaders.mockRestore();
        });

        it("parses data", () => {
            OsirisParser.parseActions(BUFFER, 2022);
            expect(GenericParser.xlsxParse).toHaveBeenCalledWith(BUFFER);
        });

        it("adds headers to rows", () => {
            OsirisParser.parseActions(BUFFER, 2022);
            ROWS.forEach((row, index) => {
                // @ts-expect-error: assert private mock calls
                expect(OsirisParser.rowToRowWithHeaders).toHaveBeenNthCalledWith(
                    index + 1,
                    HEADERS,
                    row,
                    OsirisActionEntity.defaultMainCategory,
                );
            });
        });

        it("builds indexed informations", () => {
            OsirisParser.parseActions(BUFFER, 2022);

            MAPPED_ROWS.forEach((row, index) => {
                expect(GenericParser.indexDataByPathObject).toHaveBeenNthCalledWith(
                    index + 1,
                    OsirisActionEntity.indexedInformationsPath,
                    row,
                );
            });
        });

        // this also test that the exercise is added to indexed informations
        it("returns osiris action entities", () => {
            // to test that updateDate is equal to currentDate
            jest.useFakeTimers().setSystemTime(new Date("2025-08-07"));
            const actual = OsirisParser.parseActions(BUFFER, 2022);

            // could not mock only OsirisActionEntity constructor to make this a unit test
            // static methods / properties are required during process and we cannot mock the totality of the class
            expect(actual).toMatchSnapshot();
            jest.useFakeTimers().useRealTimers();
        });
    });

    describe("getUpdateDate", () => {
        it("throws if year is higher than current year", () => {
            jest.useFakeTimers().setSystemTime(new Date("2025"));
            // @ts-expect-error: private method
            expect(() => OsirisParser.getUpdateDate(2026)).toThrow(
                "Given export year (2026) must be lower or equal to the current year (2025)",
            );
        });
    });
});
