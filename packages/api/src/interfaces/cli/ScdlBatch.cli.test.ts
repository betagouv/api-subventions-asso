import path from "path";
import ScdlBatchCli from "./ScdlBatch.cli";
import fs from "fs";

import {
    SCDL_FILE_PROCESSING_PATH,
    SCDL_FILE_PROCESSING_CONFIG_FILENAME,
} from "../../configurations/scdlIntegration.conf";
import {
    ScdlFileProcessingConfig,
    ScdlFileProcessingConfigList,
    ScdlParseCsvArgs,
} from "../../@types/ScdlDataIntegration";
import scdlService from "../../modules/providers/scdl/scdl.service";
import ScdlCli from "./Scdl.cli";
import MiscScdlProducerEntity from "../../modules/providers/scdl/entities/MiscScdlProducerEntity";
import { FileExtensionEnum } from "../../@enums/FileExtensionEnum";

import { isStringValid, isBooleanValid, isNumberValid, isShortISODateValid } from "../../shared/Validators";

jest.mock("../../modules/providers/scdl/scdl.service");
jest.mock("../cli/Scdl.cli");
jest.mock("fs");
jest.mock("path");
jest.mock("../../shared/Validators");

const BASE_SCDL_FILE_CONFIG = {
    name: "scdl-import-bretagne-2025.csv",
    addProducer: true,
    producerName: "Région Bretagne",
    producerSiret: "23350001600040",
    parseParams: { producerSlug: "bretagne" },
};

const CSV_PARSE_PARMS = { delimiter: ",", quote: "'" };
const XLS_PARSE_PARMS = { pageName: "Données au format SCDL", rowOffset: 2 };

const FILES_CONFIG = [
    {
        ...BASE_SCDL_FILE_CONFIG,
        parseParams: { ...BASE_SCDL_FILE_CONFIG.parseParams, ...CSV_PARSE_PARMS },
    },
    {
        ...BASE_SCDL_FILE_CONFIG,
        name: "scdl-import-bretagne-2025.xls",
        parseParams: { ...BASE_SCDL_FILE_CONFIG.parseParams, ...XLS_PARSE_PARMS },
    },
];

const validConfigData: ScdlFileProcessingConfigList = {
    files: [
        {
            name: "donnees-a-integrer1.csv",
            parseParams: { producerSlug: "producerSlug1", exportDate: "2025-01-13" },
            addProducer: true,
            producerName: "Test Producer 1",
            producerSiret: "12345678901",
        },
        {
            name: "donnees-a-integrer2.csv",
            parseParams: { producerSlug: "producerSlug2", exportDate: "2025-01-14" },
            addProducer: true,
            producerName: "Test Producer 2",
            producerSiret: "12345678902",
        },
        {
            name: "donnees-a-integrer3.csv",
            parseParams: { producerSlug: "producerSlug2", exportDate: "2025-01-15" },
            addProducer: false,
        },
    ],
};

describe("SCDL Batch Import CLI", () => {
    let scdlBatchCli: ScdlBatchCli;

    beforeEach(() => {
        jest.spyOn(process, "exit").mockImplementation((() => {}) as (code?: unknown) => never);
        jest.mocked(scdlService.createProducer).mockResolvedValue();
    });

    describe("isConfig", () => {
        // @ts-expect-error: spy protected method
        const mockValidateFileConfig: jest.SpyInstance = jest.spyOn(ScdlBatchCli.prototype, "validateFileConfig");

        beforeAll(() => {
            mockValidateFileConfig.mockReturnValue(true);
        });

        afterAll(() => {
            mockValidateFileConfig.mockRestore();
        });

        it.each`
            value
            ${undefined}
            ${null}
            ${{}}
            ${{ files: [] }}
            ${{ files: [{}, {}] }}
        `("return false with $value", ({ value }) => {
            // make one file invalid for last test
            if (value?.files?.length) {
                mockValidateFileConfig.mockReturnValueOnce(false);
            }
            const cli = new ScdlBatchCli();
            const expected = false;
            // @ts-expect-error: private method
            const actual = cli.isConfig(value);
            expect(actual).toEqual(expected);
        });

        it("return true", () => {
            const cli = new ScdlBatchCli();
            const expected = true;
            // @ts-expect-error: private method
            const actual = cli.isConfig({ files: [{}] });
            expect(actual).toEqual(expected);
        });
    });

    describe("validateFileConfig", () => {
        // @ts-expect-error: private method
        const mockValidateParseParams: jest.SpyInstance = jest.spyOn(ScdlBatchCli.prototype, "validateParseParams");

        const PARSE_PARAMS = { producerSlug: "bretagne" };

        beforeEach(() => {
            jest.mocked(isStringValid).mockReturnValue(true);
            jest.mocked(isBooleanValid).mockReturnValue(true);
            mockValidateParseParams.mockReturnValue(true);
            scdlBatchCli = new ScdlBatchCli();
        });

        afterAll(() => mockValidateParseParams.mockRestore());

        it("throw if no file given", () => {
            // @ts-expect-error: test private method
            expect(() => scdlBatchCli.validateFileConfig()).toThrowError(
                `You must provide a config file for SCDL batch import and name it ${SCDL_FILE_PROCESSING_CONFIG_FILENAME}`,
            );
        });

        it("add error to the list if file name is not a valid string", () => {
            jest.mocked(isStringValid).mockReturnValueOnce(false);
            const expected = { field: "name" };
            // @ts-expect-error: test private method
            scdlBatchCli.validateFileConfig({ name: 123 });
            // @ts-expect-error: access private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual(expected);
        });

        it("do not call validateParseParams if addProducer is set to false", () => {
            // @ts-expect-error: test private method
            scdlBatchCli.validateFileConfig({ name: "bretagne-2025", addProducer: false });
            expect(mockValidateParseParams).not.toHaveBeenCalled();
        });

        it("returns true if file config is valid", () => {
            const expected = true;
            // @ts-expect-error: test private method
            const actual = scdlBatchCli.validateFileConfig({ name: "bretagne-2025" });
            expect(actual).toEqual(expected);
        });

        it("calls validateParseParams() is addProducer is set to true", () => {
            // @ts-expect-error: test private method
            scdlBatchCli.validateFileConfig({ name: "name", addProducer: true, parseParams: PARSE_PARAMS });
            expect(mockValidateParseParams).toHaveBeenCalledWith(PARSE_PARAMS);
        });
    });

    describe("validateXlsArgs", () => {
        beforeAll(() => {
            jest.mocked(isStringValid).mockReturnValue(true);
            jest.mocked(isNumberValid).mockReturnValue(true);
        });

        beforeEach(() => {
            scdlBatchCli = new ScdlBatchCli();
        });

        it("concats errors if any", () => {
            jest.mocked(isStringValid).mockReturnValueOnce(false);
            jest.mocked(isNumberValid).mockReturnValueOnce(false);
            // @ts-expect-error: test private method
            scdlBatchCli.validateXlsArgs({ rowOffset: "not a number" });
            // @ts-expect-error: access private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "pageName" });
            // @ts-expect-error: access private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "rowOffset" });
        });

        it("returns false if not a valid ScdlParseXlsArgs", () => {
            jest.mocked(isStringValid).mockReturnValueOnce(false);
            jest.mocked(isNumberValid).mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: test private method
            const actual = scdlBatchCli.validateXlsArgs({ rowOffset: "not a number" });
            expect(actual).toEqual(expected);
        });

        it("returns true if it is a valid ScdlParseXlsArgs", () => {
            const expected = true;
            // @ts-expect-error: test private method
            const actual = scdlBatchCli.validateXlsArgs({ pageName: "Subventions", rowOffset: 2 });
            expect(actual).toEqual(expected);
        });
    });

    describe("validateCsvArgs", () => {
        beforeEach(() => {
            scdlBatchCli = new ScdlBatchCli();
        });

        it("pushes delimiter error", () => {
            // @ts-expect-error: test private method
            scdlBatchCli.validateCsvArgs({ producerSlug: "bretagne", delimiter: "a" });
            // @ts-expect-error: access private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "delimiter" });
        });

        it("pushes quote error", () => {
            // @ts-expect-error: test private method
            scdlBatchCli.validateCsvArgs({ producerSlug: "bretagne", quote: "a" });
            // @ts-expect-error: access private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "quote" });
        });

        it.each`
            parseParams
            ${{ producerSlug: "bretagne", delimiter: ";", quote: '"' }}
            ${{ producerSlug: "bretagne", delimiter: ";", quote: "'" }}
            ${{ producerSlug: "bretagne", delimiter: ",", quote: '"' }}
            ${{ producerSlug: "bretagne", delimiter: ",", quote: "'" }}
            ${{ producerSlug: "bretagne", delimiter: ";" }}
            ${{ producerSlug: "bretagne", delimiter: "," }}
            ${{ producerSlug: "bretagne", quote: "'" }}
            ${{ producerSlug: "bretagne", quote: '"' }}
            ${{ producerSlug: "bretagne" }}
        `("returns true if it is a valid ScdlParseCsvArgs", ({ parseParams }) => {
            const expected = true;
            // @ts-expect-error: test private method
            const actual = scdlBatchCli.validateCsvArgs(parseParams);
            expect(actual).toEqual(expected);
        });

        it.each`
            parseParams
            ${{ delimiter: ";;," }}
            ${{ quote: "(" }}
        `("returns false if it is not a valid ScdlParseCsvArgs", ({ parseParams }) => {
            const expected = false;
            // @ts-expect-error: test private method
            const actual = scdlBatchCli.validateCsvArgs(parseParams);
            expect(actual).toEqual(expected);
        });
    });

    describe("validateParseParams", () => {
        // @ts-expect-error: private method
        const spyValidateCsvArgs: jest.SpyInstance = jest.spyOn(ScdlBatchCli.prototype, "validateCsvArgs");
        // @ts-expect-error: private method
        const spyValidateXlsArgs: jest.SpyInstance = jest.spyOn(ScdlBatchCli.prototype, "validateXlsArgs");

        beforeAll(() => {
            jest.mocked(isStringValid).mockReturnValue(true);
            jest.mocked(isShortISODateValid).mockReturnValue(true);
        });

        beforeEach(() => {
            scdlBatchCli = new ScdlBatchCli();
        });

        afterAll(() => {
            spyValidateCsvArgs.mockRestore();
            spyValidateXlsArgs.mockRestore();
        });

        it.each`
            parseParams
            ${[]}
            ${undefined}
            ${"bretagne"}
        `("pushes error if parseParams is not valid", ({ parseParams }) => {
            // @ts-expect-error: private method
            scdlBatchCli.validateParseParams(parseParams);
            // @ts-expect-error: private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "parseParams" });
        });

        it("pushes error if producerSlug is not valid", () => {
            jest.mocked(isStringValid).mockReturnValueOnce(false);
            // @ts-expect-error: private method
            scdlBatchCli.validateParseParams({ producerSlug: 123 });
            // @ts-expect-error: private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "producerSlug" });
        });

        it("pushes error if exportDate is not valid", () => {
            jest.mocked(isShortISODateValid).mockReturnValueOnce(false);
            // @ts-expect-error: private method
            scdlBatchCli.validateParseParams({ exportDate: "2025" });
            // @ts-expect-error: private property
            expect(scdlBatchCli.fileConfigErrors).toContainEqual({ field: "exportDate" });
        });

        it("allows undefined exportDate", () => {
            // @ts-expect-error: private method
            scdlBatchCli.validateParseParams({ exportDate: undefined });
            // @ts-expect-error: private property
            expect(scdlBatchCli.fileConfigErrors).not.toContainEqual({ field: "exportDate" });
        });

        it.each`
            parseParams
            ${{ delimiter: ";", quote: "'" }}
            ${{ delimiter: ";" }}
            ${{ quote: "'" }}
        `("calls validate csv specific args if present", ({ parseParams }) => {
            // @ts-expect-error: private method
            scdlBatchCli.validateParseParams(parseParams);
            expect(spyValidateCsvArgs).toHaveBeenCalledWith(parseParams);
        });

        it.each`
            parseParams
            ${{ pageName: "Sheet1", rowOffset: 2 }}
            ${{ pageName: "Sheet1" }}
            ${{ rowOffset: 2 }}
        `("calls validate xls specific args if present", ({ parseParams }) => {
            // @ts-expect-error: private method
            scdlBatchCli.validateParseParams(parseParams);
            expect(spyValidateXlsArgs).toHaveBeenCalledWith(parseParams);
        });

        // for each if else block
        it.each`
            parseParams              | comment
            ${undefined}             | ${"parseParam is not defined"}
            ${[]}                    | ${"parseParam an array"}
            ${{ producerSlug: 123 }} | ${"one of the field is not valid"}
        `("return false if $comment", ({ parseParams }) => {
            // only mock one error to enter if block
            if (parseParams?.producerSlug) jest.mocked(isStringValid).mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: private method
            const actual = scdlBatchCli.validateParseParams(parseParams);
            expect(actual).toEqual(expected);
        });

        it("return true if it's a valid ScdlParseParams", () => {
            const expected = true;
            // @ts-expect-error: private method
            const actual = scdlBatchCli.validateParseParams({ producerSlug: "bretagne", exportDate: "2025-01-15" });
            expect(actual).toEqual(expected);
        });
    });

    describe("loadConfig()", () => {
        beforeAll(() => {
            scdlBatchCli = new ScdlBatchCli();
        });

        it("should load config file successfully", () => {
            jest.spyOn(fs, "readFileSync").mockReturnValueOnce(JSON.stringify(validConfigData));
            // @ts-expect-error: protected
            const result = scdlBatchCli.loadConfig();

            expect(result).toEqual(validConfigData);
        });

        it("should throw an error when the JSON file is invalid", () => {
            jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
                throw new Error("Unexpected token i in JSON at position 2");
            });
            // @ts-expect-error: protected
            expect(() => scdlBatchCli.loadConfig()).toThrowError(new Error("Unexpected token i in JSON at position 2"));
        });
    });

    describe("processFile()", () => {
        const FILE_PATH = "path-to-file/file.ext";
        // ScdlBatchCli extends ScdlCli
        const mockParse = jest.spyOn(ScdlCli.prototype, "parse").mockResolvedValue();
        const mockParseXls = jest.spyOn(ScdlCli.prototype, "parseXls").mockResolvedValue();

        beforeAll(() => {
            jest.mocked(path.join).mockReturnValue(FILE_PATH);
            // default case for tests
            jest.mocked(scdlService.getProducer).mockResolvedValue(null);
        });

        beforeEach(() => {
            scdlBatchCli = new ScdlBatchCli();
        });

        afterAll(() => {
            mockParse.mockRestore();
            mockParseXls.mockRestore();
        });

        it.each`
            fileConfig                                                                                 | errorMsg
            ${{}}                                                                                      | ${"You must provide the file name for every file's configuration."}
            ${{ name: "bretagne-2025" }}                                                               | ${"You must provide the file parameters for every file's configuration"}
            ${{ name: "bretagne-2025", parseParams: { producerSlug: "bretagne" }, addProducer: true }} | ${"You must provide the producer name and SIRET for a first import"}
        `("throws error if the file's config misses some mandatory", async ({ fileConfig, errorMsg }) => {
            try {
                // @ts-expect-error: private method
                await scdlBatchCli.processFile(fileConfig);
            } catch (e) {
                expect((e as Error).message).toEqual(errorMsg);
            }
        });

        it("resolves file config path", () => {
            // @ts-expect-error: test private method
            scdlBatchCli.processFile(FILES_CONFIG[0]);
            expect(path.resolve).toHaveBeenCalledWith(SCDL_FILE_PROCESSING_PATH);
        });

        describe("with add producer set to true", () => {
            it("add producer if it does not exist", async () => {
                // @ts-expect-error: test private method
                await scdlBatchCli.processFile(FILES_CONFIG[0]);
                expect(jest.mocked(scdlService.createProducer)).toHaveBeenCalledWith({
                    slug: FILES_CONFIG[0].parseParams.producerSlug,
                    name: FILES_CONFIG[0].producerName,
                    siret: FILES_CONFIG[0].producerSiret,
                });
            });

            it("add an error to the list if producer already exist", async () => {
                // @ts-expect-error: mock resolve value
                jest.mocked(scdlService.getProducer).mockResolvedValueOnce({} as MiscScdlProducerEntity);
                // @ts-expect-error: test private method
                await scdlBatchCli.processFile({ ...FILES_CONFIG[0] });
                // @ts-expect-error: test protected property
                expect(scdlBatchCli.errorList).toContain(
                    `Producer with slug ${FILES_CONFIG[0].parseParams.producerSlug} already exist. Used with file ${FILES_CONFIG[0].name}`,
                );
            });
        });

        it("calls parse when file type is CSV", async () => {
            jest.mocked(path.extname).mockReturnValue(`.${FileExtensionEnum.CSV}`);
            const FILE_CONF = { ...FILES_CONFIG[0] } as ScdlFileProcessingConfig<ScdlParseCsvArgs>;
            // @ts-expect-error: test private method
            await scdlBatchCli.processFile(FILE_CONF);
            expect(scdlBatchCli.parse).toHaveBeenCalledWith(
                FILE_PATH,
                FILE_CONF.parseParams.producerSlug,
                undefined,
                FILE_CONF.parseParams.delimiter,
                FILE_CONF.parseParams.quote,
            );
        });

        it.each`
            type                      | fileConf
            ${FileExtensionEnum.XLS}  | ${{ ...FILES_CONFIG[1] }}
            ${FileExtensionEnum.XLSX} | ${{ ...FILES_CONFIG[1], name: "scdl-import-bretagne-2025.xlsx" }}
        `("calls parseXls when file type is $type", async ({ type, fileConf }) => {
            jest.mocked(path.extname).mockReturnValue(`.${type}`);
            // @ts-expect-error: test private method
            await scdlBatchCli.processFile(fileConf);
            expect(scdlBatchCli.parseXls).toHaveBeenCalledWith(
                FILE_PATH,
                fileConf.parseParams.producerSlug,
                undefined,
                fileConf.parseParams.pageName,
                fileConf.parseParams.rowOffset,
            );
        });

        // only test with the extension test case
        it("add an error in the list if an error is thrown inside try block", async () => {
            const ERROR_MESSAGE = `Unsupported file type : ${FILE_PATH}`;
            jest.mocked(path.extname).mockReturnValue(`.json`);
            const FILE_CONF = FILES_CONFIG[0];
            // @ts-expect-error: test private method
            await scdlBatchCli.processFile(FILE_CONF);
            // @ts-expect-error: access protected property
            expect(scdlBatchCli.errorList).toContain(
                `parse data of ${FILE_CONF.parseParams.producerSlug} for file ${FILE_CONF.name} : ${ERROR_MESSAGE}`,
            );
        });
    });

    describe("import()", () => {
        // @ts-expect-error: private method
        const mockIsConfig: jest.SpyInstance<boolean> = jest.spyOn(ScdlBatchCli.prototype, "isConfig");
        const mockLoadConfig: jest.SpyInstance<ScdlFileProcessingConfigList> = jest.spyOn(
            ScdlBatchCli.prototype,
            // @ts-expect-error: private met"Invalid configuration file: The config does not match the expected structure."hod
            "loadConfig",
        );
        // @ts-expect-error: private method
        const mockProcessFile: jest.SpyInstance<Promise<void>> = jest.spyOn(ScdlBatchCli.prototype, "processFile");
        beforeEach(() => {
            // se default mocks returned value
            mockIsConfig.mockReturnValue(true);
            mockLoadConfig.mockReturnValue({
                files: FILES_CONFIG,
            });
            mockProcessFile.mockResolvedValue();
            scdlBatchCli = new ScdlBatchCli();
        });

        afterAll(() => {
            mockIsConfig.mockRestore();
            mockLoadConfig.mockRestore();
            mockProcessFile.mockRestore();
        });

        it("loads config", async () => {
            await scdlBatchCli.import();
            expect(mockLoadConfig).toHaveBeenCalledTimes(1);
        });

        it("throw if config file is not valid", () => {
            mockIsConfig.mockReturnValue(false);
            expect(() => scdlBatchCli.import()).rejects.toThrow(
                "Invalid configuration file: The config does not match the expected structure.",
            );
        });

        it("imports each file in the config file", async () => {
            await scdlBatchCli.import();
            FILES_CONFIG.map((file, index) => expect(mockProcessFile).toHaveBeenNthCalledWith(index + 1, file));
        });

        it("throws if one of the processFile() failed", async () => {
            const error = new Error("SOMETHING WENT WRONG");
            mockProcessFile.mockRejectedValueOnce(error);
            await expect(async () => await scdlBatchCli.import()).rejects.toThrow(error);
        });

        it("logs errors from list", async () => {
            const spyConsoleLog = jest.spyOn(console, "log");
            const ERRORS = [
                `Something went wrong with ${FILES_CONFIG[0].name}`,
                `Something went wrong with ${FILES_CONFIG[1].name}`,
            ];
            // @ts-expect-error: private property
            scdlBatchCli.errorList = ERRORS;
            await scdlBatchCli.import();
            expect(spyConsoleLog).toHaveBeenNthCalledWith(1, "\n---------------Summary of Operations---------------");
            expect(spyConsoleLog).toHaveBeenNthCalledWith(2, "⚠️ List of Errors :");
            expect(spyConsoleLog).toHaveBeenNthCalledWith(3, `❌ ${ERRORS[0]}`);
            expect(spyConsoleLog).toHaveBeenNthCalledWith(4, `❌ ${ERRORS[1]}`);
            spyConsoleLog.mockRestore();
        });

        it("displays log when all processing files succeed", async () => {
            const SUCCESS = [`Success importing ${FILES_CONFIG[0].name}`, `Success importing ${FILES_CONFIG[1].name}`];
            const spyConsoleLog = jest.spyOn(console, "log");
            // @ts-expect-error: affect private prop
            scdlBatchCli.successList = SUCCESS;
            await scdlBatchCli.import();
            expect(spyConsoleLog).toHaveBeenNthCalledWith(1, "\n---------------Summary of Operations---------------");
            expect(spyConsoleLog).toHaveBeenNthCalledWith(2, "🚀 All operations completed successfully! 🎯");
            spyConsoleLog.mockRestore();
        });

        it("logs errors and success", async () => {
            const SUCCESS = [`Success importing ${FILES_CONFIG[0].name}`];
            const ERRORS = [`Something went wrong with ${FILES_CONFIG[1].name}`];
            const spyConsoleLog = jest.spyOn(console, "log");
            // @ts-expect-error: affect private prop
            scdlBatchCli.successList = SUCCESS;
            // @ts-expect-error: affect private prop
            scdlBatchCli.errorList = ERRORS;
            await scdlBatchCli.import();
            expect(spyConsoleLog).toHaveBeenNthCalledWith(1, "\n---------------Summary of Operations---------------");
            expect(spyConsoleLog).toHaveBeenNthCalledWith(2, "✅ list of Success :");
            expect(spyConsoleLog).toHaveBeenNthCalledWith(3, `➡️ ${SUCCESS[0]}`);
            expect(spyConsoleLog).toHaveBeenNthCalledWith(4, "⚠️ List of Errors :");
            expect(spyConsoleLog).toHaveBeenNthCalledWith(5, `❌ ${ERRORS[0]}`);
            spyConsoleLog.mockRestore();
        });
    });
});
