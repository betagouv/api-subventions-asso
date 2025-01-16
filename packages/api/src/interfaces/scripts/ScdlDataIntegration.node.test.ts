import fs from "fs";
import path from "path";
import { main, loadConfig, processFile } from "./ScdlDataIntegration.node";
import {
    SCDL_FILE_PROCESSING_PATH,
    SCDL_FILE_PROCESSING_CONFIG_FILENAME,
} from "../../configurations/scdlIntegration.conf";
import ScdlCli from "../cli/Scdl.cli";
import { ScdlParseArgs, ScdlParseXlsArgs } from "../../@types/ScdlDataIntegration";

jest.mock("../../configurations/scdlIntegration.conf", () => ({
    SCDL_FILE_PROCESSING_PATH: path.resolve(__dirname, "test-integration"),
    SCDL_FILE_PROCESSING_CONFIG_FILENAME: "test-scdl-file-processing-config.json",
}));
jest.mock("../cli/Scdl.cli");

const validConfigData = {
    files: [
        {
            name: "donnees-a-integrer1.csv",
            parseParams: ["producerSlug1", "2025-01-13"],
            addProducer: true,
            producerName: "Test Producer 1",
            producerSiret: "12345678901",
        },
        {
            name: "donnees-a-integrer2.csv",
            parseParams: ["producerSlug2", "2025-01-14"],
            addProducer: true,
            producerName: "Test Producer 2",
            producerSiret: "12345678902",
        },
        {
            name: "donnees-a-integrer3.csv",
            parseParams: ["producerSlug2", "2025-01-15"],
            addProducer: false,
        },
    ],
};

describe("scdl-data-integration.node", () => {
    const testFilePath = path.join(SCDL_FILE_PROCESSING_PATH, SCDL_FILE_PROCESSING_CONFIG_FILENAME);

    let addProducerMock: jest.SpyInstance<Promise<void>, [slug: string, name: string, siret: string]>;
    let parseMock: jest.SpyInstance<
        Promise<void>,
        [
            file: string,
            producerSlug: string,
            exportDate: string,
            delimiter?: string | undefined,
            quote?: string | undefined,
        ]
    >;
    let parseXlsMock: jest.SpyInstance<
        Promise<void>,
        [
            file: string,
            producerSlug: string,
            exportDate: string,
            pageName?: string | undefined,
            rowOffsetStr?: string | number | undefined,
        ]
    >;

    beforeAll(() => {
        if (!fs.existsSync(SCDL_FILE_PROCESSING_PATH)) {
            fs.mkdirSync(SCDL_FILE_PROCESSING_PATH);
        }
    });

    afterAll(() => {
        if (fs.existsSync(SCDL_FILE_PROCESSING_PATH)) {
            fs.rmSync(SCDL_FILE_PROCESSING_PATH, { recursive: true });
        }
    });

    beforeEach(() => {
        jest.spyOn(process, "exit").mockImplementation((() => {}) as (code?: number) => never);
        addProducerMock = jest.spyOn(ScdlCli.prototype, "addProducer").mockResolvedValue();
        parseMock = jest.spyOn(ScdlCli.prototype, "parse").mockResolvedValue();
        parseXlsMock = jest.spyOn(ScdlCli.prototype, "parseXls").mockResolvedValue();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    describe("loadConfig method", () => {
        it("should load config file successfully", () => {
            fs.writeFileSync(testFilePath, JSON.stringify(validConfigData));
            const result = loadConfig();

            expect(result).toEqual(validConfigData);
        });

        it("should throw an error when the JSON file is invalid", () => {
            const invalidJsonData = "{ invalidJson: true ";

            fs.writeFileSync(testFilePath, invalidJsonData);

            expect(() => {
                loadConfig();
            }).toThrowError(new Error("Unexpected token i in JSON at position 2"));
        });

        it("should throw an error when the JSON file does not exist", () => {
            expect(() => {
                loadConfig();
            }).toThrowError(
                expect.objectContaining({
                    message: expect.stringContaining("ENOENT: no such file or directory"),
                }),
            );
        });
    });

    describe("Test for processFile method", () => {
        const fileConfig = {
            name: "donnees-a-integrer1.csv",
            parseParams: ["producerSlug1", "2025-01-13"] as ScdlParseArgs,
            addProducer: true,
            producerName: "Test Producer 1",
            producerSiret: "12345678901",
        };

        const fileConfigWrongType = {
            name: "donnees-a-integrer1.doc",
            parseParams: ["producerSlug1", "2025-01-13"] as ScdlParseXlsArgs,
            addProducer: true,
            producerName: "Test Producer 1",
            producerSiret: "12345678901",
        };

        it("should process file methods correctly", async () => {
            await expect(processFile(fileConfig)).resolves.toBeUndefined();

            expect(addProducerMock).toHaveBeenCalledTimes(1);
            expect(addProducerMock).toHaveBeenCalledWith(
                fileConfig.parseParams[0],
                fileConfig.producerName,
                fileConfig.producerSiret,
            );

            expect(parseMock).toHaveBeenCalledTimes(1);
            expect(parseMock).toHaveBeenCalledWith(
                expect.stringContaining(fileConfig.name),
                fileConfig.parseParams[0],
                fileConfig.parseParams[1],
                undefined,
                undefined,
            );
            expect(parseXlsMock).not.toHaveBeenCalled();
        });

        it("should catch error and not call parse method", async () => {
            addProducerMock = jest
                .spyOn(ScdlCli.prototype, "addProducer")
                .mockRejectedValue(new Error("Mocked addProducer error"));
            await expect(processFile(fileConfig)).resolves.toBeUndefined();
            expect(addProducerMock).toHaveBeenCalledTimes(1);
            expect(parseMock).not.toHaveBeenCalled();
            expect(parseXlsMock).not.toHaveBeenCalled();
        });

        it("should catch Unsupported file type error and not call parse method", async () => {
            await expect(processFile(fileConfigWrongType)).resolves.toBeUndefined();
            expect(addProducerMock).toHaveBeenCalledTimes(1);
            expect(parseMock).not.toHaveBeenCalled();
            expect(parseXlsMock).not.toHaveBeenCalled();
        });

        it("should catch Producer already exists error and call parse method", async () => {
            addProducerMock = jest
                .spyOn(ScdlCli.prototype, "addProducer")
                .mockRejectedValue(new Error("Producer already exists"));

            await expect(processFile(fileConfig)).resolves.toBeUndefined();
            expect(addProducerMock).toHaveBeenCalledTimes(1);
            expect(parseMock).toHaveBeenCalledTimes(1);
            expect(parseXlsMock).not.toHaveBeenCalled();
        });
    });

    describe("Test for main script", () => {
        it("should call ScdlCli methods with correct arguments", async () => {
            fs.writeFileSync(testFilePath, JSON.stringify(validConfigData));

            await expect(main()).resolves.toBeUndefined();

            expect(addProducerMock).toHaveBeenCalledTimes(2);
            expect(addProducerMock).toHaveBeenCalledWith("producerSlug1", "Test Producer 1", "12345678901");
            expect(addProducerMock).toHaveBeenCalledWith("producerSlug2", "Test Producer 2", "12345678902");

            expect(parseMock).toHaveBeenCalledTimes(3);
            expect(parseMock).toHaveBeenCalledWith(
                path.join(SCDL_FILE_PROCESSING_PATH, "donnees-a-integrer1.csv"),
                "producerSlug1",
                "2025-01-13",
                undefined,
                undefined,
            );
            expect(parseMock).toHaveBeenCalledWith(
                path.join(SCDL_FILE_PROCESSING_PATH, "donnees-a-integrer2.csv"),
                "producerSlug2",
                "2025-01-14",
                undefined,
                undefined,
            );
            expect(parseMock).toHaveBeenCalledWith(
                path.join(SCDL_FILE_PROCESSING_PATH, "donnees-a-integrer3.csv"),
                "producerSlug2",
                "2025-01-15",
                undefined,
                undefined,
            );
            expect(parseXlsMock).not.toHaveBeenCalled();
        });

        it("should throw Unexpected token error", async () => {
            const invalidJsonData = "{ invalidJson: true ";

            fs.writeFileSync(testFilePath, invalidJsonData);
            await expect(main()).rejects.toThrow("Unexpected token i in JSON at position 2");
            expect(addProducerMock).not.toHaveBeenCalled();
            expect(parseMock).not.toHaveBeenCalled();
            expect(parseXlsMock).not.toHaveBeenCalled();
        });

        it("should throw Invalid configuration file error", async () => {
            const invalidConfigData = {
                files: [
                    {
                        name: "donnees-a-integrer1.csv",
                        addProducer: true,
                        producerName: "Test Producer 1",
                        producerSiret: "12345678901",
                    },
                ],
            };
            fs.writeFileSync(testFilePath, JSON.stringify(invalidConfigData));

            await expect(main()).rejects.toThrow(
                "Invalid configuration file: The config does not match the expected structure.",
            );
            expect(addProducerMock).not.toHaveBeenCalled();
            expect(parseMock).not.toHaveBeenCalled();
            expect(parseXlsMock).not.toHaveBeenCalled();
        });

        it("when error with one file, should process continue for other files", async () => {
            const configData = {
                files: [
                    {
                        name: "donnees-a-integrer1.xlsx",
                        parseParams: ["producerSlug1", "2025-01-13"] as ScdlParseXlsArgs,
                        addProducer: true,
                        producerName: "Test Producer 1",
                        producerSiret: "12345678901",
                    },
                    {
                        name: "donnees-a-integrer2.csv",
                        parseParams: ["producerSlug2", "2025-01-14"] as ScdlParseArgs,
                        addProducer: true,
                        producerName: "Test Producer 2",
                        producerSiret: "12345678902",
                    },
                    {
                        name: "donnees-a-integrer3.csv",
                        parseParams: ["producerSlug3", "2025-01-15"] as ScdlParseArgs,
                        addProducer: true,
                        producerName: "Test Producer 3",
                        producerSiret: "12345678903",
                    },
                ],
            };
            fs.writeFileSync(testFilePath, JSON.stringify(configData));
            parseXlsMock = jest
                .spyOn(ScdlCli.prototype, "parseXls")
                .mockRejectedValue(new Error("Mocked addProducer error"));

            await expect(main()).resolves.toBeUndefined();
            expect(addProducerMock).toHaveBeenCalledTimes(3);
            expect(parseMock).toHaveBeenCalledTimes(2);
            expect(parseXlsMock).toHaveBeenCalledTimes(1);
        });
    });
});
