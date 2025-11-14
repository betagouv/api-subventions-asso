import fs from "fs";
import { ObjectId } from "mongodb";
import { normalize } from "path";

jest.mock("csv-stringify/sync", () => ({
    stringify: jest.fn(() => ""),
}));

jest.mock("fs");
jest.mocked(fs);
import * as CliHelper from "../../shared/helpers/CliHelper";
jest.mock("../../shared/helpers/CliHelper");
import ScdlCli from "./Scdl.cli";
import scdlService from "../../modules/providers/scdl/scdl.service";

jest.mock("../../modules/providers/scdl/scdl.service");
const mockedScdlService = jest.mocked(scdlService);
import MiscScdlGrant from "../../modules/providers/scdl/__fixtures__/MiscScdlGrant";
import MiscScdlProducer from "../../modules/providers/scdl/__fixtures__/MiscScdlProducer";
import { MixedParsedError, ParsedErrorFormat } from "../../modules/providers/scdl/@types/Validation";
import csvSyncStringifier from "csv-stringify/sync";
import dataLogService from "../../modules/data-log/dataLog.service";

jest.mock("../../modules/data-log/dataLog.service");
import scdlGrantService from "../../modules/providers/scdl/scdl.grant.service";
import applicationFlatService from "../../modules/applicationFlat/applicationFlat.service";
import { ScdlParsedInfos } from "../../modules/providers/scdl/@types/ScdlParsedInfos";
import Siret from "../../identifierObjects/Siret";
jest.mock("../../modules/providers/scdl/scdl.grant.service");
jest.mock("../../modules/applicationFlat/applicationFlat.service");
jest.mock("../../modules/notify/notify.service", () => ({ notify: jest.fn() }));
jest.mock("csv-stringify/sync");

describe("ScdlCli", () => {
    const PRODUCER_ENTITY = {
        _id: new ObjectId(),
        ...MiscScdlProducer,
    };
    const PRODUCER_SIRET = new Siret(PRODUCER_ENTITY.siret);
    const GRANT = { ...MiscScdlGrant };
    const STORABLE_DATA = { ...GRANT, __data__: {} };
    const FILE_CONTENT = Buffer.from("FILE_CONTENT");
    const EXPORT_DATE_STR = "2023-03-23";
    const FILE_PATH = "FILE_PATH";
    const STORABLE_DATA_ARRAY = [STORABLE_DATA];
    const DELIMETER = "%";
    const PAGE_NAME = "nom de feuille";
    const ROW_OFFSET = 4;
    const QUOTE = '"';

    let cli: ScdlCli;

    beforeEach(() => {
        mockedScdlService.getProducer.mockResolvedValue(PRODUCER_ENTITY);
        mockedScdlService.parseCsv.mockReturnValue({
            entities: STORABLE_DATA_ARRAY,
            errors: [],
            parsedInfos: {} as ScdlParsedInfos,
        });
        mockedScdlService.parseXls.mockReturnValue({
            entities: STORABLE_DATA_ARRAY,
            errors: [],
            parsedInfos: {} as ScdlParsedInfos,
        });

        cli = new ScdlCli();
    });

    describe("addProducer", () => {
        it("should call scdlService.createProducer()", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            await cli.addProducer(PRODUCER_ENTITY.siret);
            expect(scdlService.createProducer).toHaveBeenCalledWith(PRODUCER_SIRET);
        });

        it("should throw Error if no SIRET", () => {
            expect(() =>
                // @ts-expect-error: test purpose
                cli.addProducer(),
            ).rejects.toThrow("Invalid Siret : undefined");
        });

        it("should throw Error if SIRET is not valid", () => {
            const WRONG_SIRET = "1234";
            expect(() => cli.addProducer(WRONG_SIRET)).rejects.toThrow(`Invalid Siret : ${WRONG_SIRET}`);
        });

        it("should throw Error if producer already exists", () => {
            expect(() => cli.addProducer(PRODUCER_ENTITY.siret)).rejects.toThrow("Producer already exists");
        });
    });

    function testParseCsv() {
        return cli.parse(FILE_PATH, PRODUCER_ENTITY.siret, EXPORT_DATE_STR, DELIMETER);
    }

    function testParseXls() {
        return cli.parseXls(FILE_PATH, PRODUCER_ENTITY.siret, EXPORT_DATE_STR, PAGE_NAME, ROW_OFFSET);
    }

    describe.each`
        methodName    | test            | parserMethod  | parserArgs
        ${"parse"}    | ${testParseCsv} | ${"parseCsv"} | ${[FILE_CONTENT, DELIMETER, QUOTE]}
        ${"parseXls"} | ${testParseXls} | ${"parseXls"} | ${[FILE_CONTENT, PAGE_NAME, ROW_OFFSET]}
    `("$methodName", ({ test, parserMethod, parserArgs }) => {
        const ERRORS = ["ERRORS"];

        beforeEach(() => {
            mockedScdlService[parserMethod].mockReturnValue({ entities: STORABLE_DATA_ARRAY, errors: ERRORS });
            // @ts-expect-error: mock private method
            jest.spyOn(cli, "end").mockResolvedValue();
            jest.spyOn(scdlService, "persist").mockResolvedValue();
            jest.mocked(CliHelper.detectAndEncode).mockReturnValue(FILE_CONTENT);
        });

        it("sanitizes input", async () => {
            // @ts-expect-error -- test private
            const sanitizeSpy = jest.spyOn(cli, "validateGenericInput");
            await test();
            expect(sanitizeSpy).toHaveBeenCalledWith(PRODUCER_ENTITY, EXPORT_DATE_STR);
        });

        it("encode and read file", async () => {
            // const spyDetectAndEncode = jest.spyOn(CliHelper, "detectAndEncode");
            await test();
            expect(CliHelper.detectAndEncode).toHaveBeenCalledWith(FILE_PATH);
        });

        it("parses file in entities", async () => {
            await test();
            expect(scdlService[parserMethod]).toHaveBeenCalledWith(...parserArgs);
        });

        it("executes persistence process", async () => {
            await test();
            expect(scdlService.persist).toHaveBeenCalledWith(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
        });

        it("executes end of import process", async () => {
            await test();
            // @ts-expect-error: test private method
            expect(cli.end).toHaveBeenCalledWith({
                file: FILE_PATH,
                errors: ERRORS,
                producer: PRODUCER_ENTITY,
                exportDate: EXPORT_DATE_STR,
            });
        });
    });

    describe("end", () => {
        // @ts-expect-error: mock resolved value
        const ERRORS = ["ERROR_1", "ERROR_2"] as MixedParsedError[];

        beforeEach(() => {
            // @ts-expect-error: mock private method
            cli.exportErrors = jest.fn();
        });

        it("exports errors", async () => {
            // @ts-expect-error: mock errors
            const ERRORS = ["ERROR_1", "ERROR_2"] as MixedParsedError[];
            // @ts-expect-error: test private method
            await cli.end({
                file: FILE_PATH,
                errors: ERRORS,
                producer: PRODUCER_ENTITY,
                exportDate: EXPORT_DATE_STR,
            });
            // @ts-expect-error: method is mocked
            expect(jest.mocked(cli.exportErrors)).toHaveBeenCalledWith(ERRORS, FILE_PATH);
        });

        it("logs import", async () => {
            // @ts-expect-error: test private method
            await cli.end({
                file: FILE_PATH,
                errors: ERRORS,
                producer: PRODUCER_ENTITY,
                exportDate: EXPORT_DATE_STR,
            });
            expect(jest.mocked(dataLogService.addLog)).toHaveBeenCalledWith(
                PRODUCER_ENTITY.slug,
                FILE_PATH,
                new Date(EXPORT_DATE_STR),
            );
        });
    });

    describe("validateGenericInput", () => {
        it("validates export date", async () => {
            // @ts-expect-error -- test private
            cli.validateGenericInput(PRODUCER_ENTITY.slug, EXPORT_DATE_STR);
            expect(CliHelper.validateDate).toHaveBeenCalledWith(EXPORT_DATE_STR);
        });

        it("does not validates date if undefined", async () => {
            // @ts-expect-error -- test private
            cli.validateGenericInput(PRODUCER_ENTITY.slug);
            expect(CliHelper.validateDate).not.toHaveBeenCalled();
        });

        it("should throw Error when provider is undefined", async () => {
            mockedScdlService.getProducer.mockResolvedValue(null);
            // @ts-expect-error -- test private
            expect(() => cli.validateGenericInput(undefined)).rejects.toThrow();
        });
    });

    describe("exportErrors", () => {
        const ERRORS: ParsedErrorFormat[] = [];
        const FILE = "path/file.csv";
        const STR_CONTENT = "azertyuiop";
        // normalize for windows and linux compatilibity
        const OUTPUT_PATH = normalize("import-errors/file.csv-errors.csv");

        beforeAll(() => {
            jest.mocked(csvSyncStringifier.stringify).mockReturnValue(STR_CONTENT);
        });

        afterAll(() => {
            jest.mocked(csvSyncStringifier.stringify).mockRestore();
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

        it("writes in proper path", () => {
            // @ts-expect-error -- test private method
            cli.exportErrors(ERRORS, FILE);
            expect(fs.writeFileSync).toHaveBeenCalledWith(OUTPUT_PATH, STR_CONTENT, { flag: "w", encoding: "utf-8" });
        });
    });

    describe("initApplicationFlat", () => {
        it("checks if there is already data", async () => {
            await cli.initApplicationFlat();
            expect(applicationFlatService.containsDataFromProvider).toHaveBeenCalledWith(/^scdl-/);
        });

        it("if there is no data, call service", async () => {
            jest.mocked(applicationFlatService.containsDataFromProvider).mockResolvedValueOnce(false);
            await cli.initApplicationFlat();
            expect(scdlGrantService.initApplicationFlat).toHaveBeenCalled();
        });

        it("if there is data, do not call service", async () => {
            jest.mocked(applicationFlatService.containsDataFromProvider).mockResolvedValueOnce(true);
            await cli.initApplicationFlat();
            expect(scdlGrantService.initApplicationFlat).not.toHaveBeenCalled();
        });

        it("if there is data, show warning", async () => {
            const spyConsole = jest.spyOn(console, "warn");
            jest.mocked(applicationFlatService.containsDataFromProvider).mockResolvedValueOnce(true);
            await cli.initApplicationFlat();
            expect(spyConsole).toHaveBeenCalled();
        });
    });
});
