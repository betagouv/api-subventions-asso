import OsirisParser from "./osiris.parser";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import OsirisRequestEntityFixture, {
    OSIRIS_ACTION_ENTITY,
} from "../../../../tests/modules/providers/osiris/__fixtures__/entity";
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
        const INDEXED_INFORMATIONS = OsirisRequestEntityFixture.providerInformations;
        const LEGAL_INFORMATIONS = OsirisRequestEntityFixture.legalInformations;
        let indexDataCount = 0;

        beforeAll(() => {
            jest.spyOn(GenericParser, "xlsParse").mockReturnValue([DATA]); // data wrap in array because first xls page
            // indexDataByPathObject is called twice, once for legal informations and once for indexed informations for each row
            jest.spyOn(GenericParser, "indexDataByPathObject").mockImplementation(() => {
                let mockedData;
                if (indexDataCount % 2 === 0) mockedData = INDEXED_INFORMATIONS;
                else mockedData = LEGAL_INFORMATIONS;
                indexDataCount++;
                return mockedData;
            });

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
            OsirisParser.parseRequests(BUFFER, 2022);
            expect(GenericParser.xlsParse).toHaveBeenCalledWith(BUFFER);
        });

        it("adds headers to rows", () => {
            OsirisParser.parseRequests(BUFFER, 2022);
            ROWS.forEach((row, index) => {
                // @ts-expect-error: assert private mock calls
                expect(OsirisParser.rowToRowWithHeaders).toHaveBeenNthCalledWith(
                    index + 1,
                    HEADERS,
                    row,
                    OsirisRequestEntity.defaultMainCategory,
                );
            });
        });

        it("builds indexed informations", () => {
            OsirisParser.parseRequests(BUFFER, 2022);

            MAPPED_ROWS.forEach((row, index) => {
                expect(GenericParser.indexDataByPathObject).toHaveBeenNthCalledWith(
                    index + 1 + index, // add second time index to skip legal informations calls
                    OsirisRequestEntity.indexedProviderInformationsPath,
                    row,
                );
            });
        });

        it("builds legal informations", () => {
            OsirisParser.parseRequests(BUFFER, 2022);
            MAPPED_ROWS.forEach((row, index) => {
                expect(GenericParser.indexDataByPathObject).toHaveBeenNthCalledWith(
                    index + 1 + index + 1, // add another index + 1 to skip indexed informations calls
                    OsirisRequestEntity.indexedLegalInformationsPath,
                    row,
                );
            });
        });

        // this also test that the exercise is added to indexed informations
        it("returns osiris request entities", () => {
            // to test that updateDate is equal to currentDate
            jest.useFakeTimers().setSystemTime(new Date("2025-08-07"));
            const actual = OsirisParser.parseRequests(BUFFER, 2022);

            // could not mock only OsirisRequestEntity constructor to make this a unit test
            // static methods / properties are required during process and we cannot mock the totality of the class
            expect(actual).toMatchSnapshot();
            jest.useFakeTimers().useRealTimers();
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
            jest.spyOn(GenericParser, "xlsParse").mockReturnValue([DATA]); // data wrap in array because first xls page
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
            expect(GenericParser.xlsParse).toHaveBeenCalledWith(BUFFER);
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
                "Given export year must be lower or equal to the current year",
            );
        });
    });
});
