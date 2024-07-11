import fs from "fs";
import { ObjectId } from "mongodb";

jest.mock("csv-stringify/sync", () => ({
    stringify: jest.fn(() => ""),
}));

jest.mock("fs");
const mockedFs = jest.mocked(fs);
import ExportDateError from "../../shared/errors/cliErrors/ExportDateError";
import ScdlCli from "./Scdl.cli";
import scdlService from "../../modules/providers/scdl/scdl.service";

jest.mock("../../modules/providers/scdl/scdl.service");
const mockedScdlService = jest.mocked(scdlService);
import MiscScdlGrant from "../../modules/providers/scdl/__fixtures__/MiscScdlGrant";
import { DuplicateIndexError } from "../../shared/errors/dbError/DuplicateIndexError";
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import MiscScdlProducer from "../../modules/providers/scdl/__fixtures__/MiscScdlProducer";
import { ParsedDataWithProblem } from "../../modules/providers/scdl/@types/Validation";

jest.mock("../../modules/providers/scdl/scdl.grant.parser");
const mockedScdlGrantParser = jest.mocked(ScdlGrantParser);

import csvSyncStringifier = require("csv-stringify/sync");
import exp from "node:constants";
jest.mock("csv-stringify/sync");

describe("ScdlCli", () => {
    const PRODUCER_ENTITY = {
        _id: new ObjectId(),
        ...MiscScdlProducer,
    };
    const GRANT = { ...MiscScdlGrant };
    const STORABLE_DATA = { ...GRANT, __data__: {} };
    const FILE_CONTENT = "FILE_CONTENT";
    const EXPORT_DATE = new Date();
    const EXPORT_DATE_STR = EXPORT_DATE.toString();
    const UNIQUE_ID = "UNIQUE_ID";
    const FILE_PATH = "FILE_PATH";
    const STORABLE_DATA_ARRAY = [STORABLE_DATA];
    const DELIMETER = "%";
    const PAGE_NAME = "nom de feuille";
    const ROW_OFFSET = 4;

    let cli: ScdlCli;

    beforeEach(() => {
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
        mockedScdlService.getProducer.mockResolvedValue(PRODUCER_ENTITY);
        // @ts-expect-error: private method
        mockedScdlService._buildGrantUniqueId.mockReturnValue(UNIQUE_ID);
        mockedScdlGrantParser.parseCsv.mockReturnValue({ entities: STORABLE_DATA_ARRAY, errors: [] });
        mockedScdlGrantParser.parseExcel.mockReturnValue({ entities: STORABLE_DATA_ARRAY, errors: [] });
        cli = new ScdlCli();
    });

    describe("addProducer", () => {
        it("should call scdlService.createProducer()", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            await cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name, PRODUCER_ENTITY.siret);
            expect(scdlService.createProducer).toHaveBeenCalledWith({
                slug: PRODUCER_ENTITY.slug,
                name: PRODUCER_ENTITY.name,
                siret: PRODUCER_ENTITY.siret,
                lastUpdate: expect.any(Date),
            });
        });

        it("should throw Error if no ID", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(),
            ).rejects.toThrowError("producer SLUG is mandatory");
        });

        it("should throw Error if no NAME", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(PRODUCER_ENTITY.slug),
            ).rejects.toThrowError("producer NAME is mandatory");
        });

        it("should throw Error if no SIRET", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name),
            ).rejects.toThrowError("producer SIRET is mandatory");
        });

        it("should throw Error if SIRET is not valid", () => {
            expect(() => cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name, "1234")).rejects.toThrowError(
                "SIRET is not valid",
            );
        });

        it("should throw Error if producer already exists", () => {
            expect(() =>
                cli.addProducer(PRODUCER_ENTITY.slug, PRODUCER_ENTITY.name, PRODUCER_ENTITY.siret),
            ).rejects.toThrowError("Producer already exists");
        });
    });

    function testParseCsv() {
        return cli.parse(FILE_PATH, PRODUCER_ENTITY.slug, EXPORT_DATE_STR, DELIMETER);
    }

    function testParseXls() {
        return cli.parseXls(FILE_PATH, PRODUCER_ENTITY.slug, EXPORT_DATE_STR, PAGE_NAME, ROW_OFFSET);
    }

    describe.each`
        methodName    | test            | parserMethod                  | parserArgs
        ${"parse"}    | ${testParseCsv} | ${ScdlGrantParser.parseCsv}   | ${[FILE_CONTENT, DELIMETER]}
        ${"parseXls"} | ${testParseXls} | ${ScdlGrantParser.parseExcel} | ${[FILE_CONTENT, PAGE_NAME, ROW_OFFSET]}
    `("$methodName", ({ test, parserMethod, parserArgs }) => {
        it("sanitizes input", async () => {
            // @ts-expect-error -- test private
            const sanitizeSpy = jest.spyOn(cli, "validateGenericInput");
            await test();
            expect(sanitizeSpy).toHaveBeenCalledWith(FILE_PATH, PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
        });

        it("reads file", async () => {
            await test();
            expect(fs.readFileSync).toHaveBeenCalledWith(FILE_PATH);
        });

        it("should call parser", async () => {
            await test();
            expect(parserMethod).toHaveBeenCalledWith(...parserArgs);
        });

        it("persists entities", async () => {
            // @ts-expect-error -- test private
            const persistSpy = jest.spyOn(cli, "persistEntities").mockReturnValueOnce(Promise.resolve());
            jest.mocked(parserMethod).mockReturnValueOnce({ entities: STORABLE_DATA_ARRAY });
            await test();
            expect(persistSpy).toHaveBeenCalledWith(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
        });

        it("exports errors", async () => {
            const ERRORS = "toto" as unknown as any[];
            // @ts-expect-error -- test private
            const exportSpy = jest.spyOn(cli, "exportErrors").mockReturnValueOnce(Promise.resolve());
            jest.mocked(parserMethod).mockReturnValueOnce({ entities: STORABLE_DATA_ARRAY, errors: ERRORS });
            await test();
            expect(exportSpy).toHaveBeenCalledWith(ERRORS, FILE_PATH);
        });
    });

    describe("persistEntities", () => {
        it("should call scdlService.createManyGrants()", async () => {
            // @ts-expect-error -- test private
            await cli.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
            expect(scdlService.createManyGrants).toHaveBeenCalledWith(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug);
        });

        it("if DuplicateIndexError arises, doesn't fail and logs", async () => {
            mockedScdlService.createManyGrants.mockRejectedValueOnce(
                new DuplicateIndexError("error", [1, 2, 3, 4, 5, 6]),
            );
            // @ts-expect-error -- test private
            await cli.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
        });

        it("if another error arises, fail and throw it again", async () => {
            const ERROR = new Error("error");
            mockedScdlService.createManyGrants.mockRejectedValueOnce(ERROR);
            // @ts-expect-error -- test private
            const test = () => cli.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
            await expect(test).rejects.toThrowError(ERROR);
        });

        it("should call scdlService.updateProducer()", async () => {
            // @ts-expect-error -- test private
            await cli.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
            expect(scdlService.updateProducer).toHaveBeenCalledWith(PRODUCER_ENTITY.slug, {
                lastUpdate: new Date(EXPORT_DATE_STR),
            });
        });
    });

    describe("validateGenericInput", () => {
        it("should throw ExportDateError", async () => {
            // @ts-expect-error -- test private
            expect(() => cli.validateGenericInput(PRODUCER_ENTITY.slug)).rejects.toThrowError(ExportDateError);
        });

        it("should throw Error when providerId does not match any provider in database", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            // @ts-expect-error -- test private
            expect(() => cli.validateGenericInput("WRONG_ID", new Date())).rejects.toThrowError();
        });
    });

    describe("exportErrors", () => {
        const ERRORS: ParsedDataWithProblem[] = [];
        const FILE = "path/file.csv";
        const STR_CONTENT = "azertyuiop";
        const BUFFER = "buffer" as unknown as Buffer;
        const OUTPUT_PATH = "importErrors/file.csv-errors.csv";
        let bufferSpy: jest.SpyInstance;

        beforeAll(() => {
            jest.mocked(csvSyncStringifier.stringify).mockReturnValue(STR_CONTENT);
            bufferSpy = jest.spyOn(Buffer, "from").mockReturnValue(BUFFER);
        });

        afterAll(() => {
            jest.mocked(csvSyncStringifier.stringify).mockRestore();
            jest.spyOn(Buffer, "from").mockRestore();
        });

        it("creates folder if does not exist", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(false);
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            expect(fs.mkdirSync).toHaveBeenCalled();
        });

        it("does not crete folder if exists already", () => {
            jest.mocked(fs.existsSync).mockReturnValueOnce(true);
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            expect(fs.mkdirSync).not.toHaveBeenCalled();
        });

        it("stringifies errors", () => {
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            expect(csvSyncStringifier.stringify).toHaveBeenCalled();
        });

        it("creates buffer from stringified errors", () => {
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            expect(bufferSpy).toHaveBeenCalledWith(STR_CONTENT);
        });

        it("writes in proper path", () => {
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            expect(fs.open).toHaveBeenCalledWith(OUTPUT_PATH, "w", expect.any(Function));
        });

        it("writes buffer", () => {
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            // @ts-expect-error -- fs.open has different signatures and ts selects wrong one
            const write: Function = jest.mocked(fs.open).mock.calls[0][2] as Function;
            write(null, 0);
            const expected = BUFFER;
            const actual = jest.mocked(fs.write).mock.calls[0][1];
            expect(actual).toBe(expected);
        });
    });
});
