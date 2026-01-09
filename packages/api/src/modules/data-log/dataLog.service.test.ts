import dataLogService from "./dataLog.service";
import dataLogPort from "../../dataProviders/db/data-log/dataLog.port";
import { DataLogAdapter } from "./dataLog.adapter";
import { RAW_PROVIDER } from "../providers/__fixtures__/providers.fixture";
import { ApiDataLogEntity, DataLogSource, FileDataLogEntity } from "./entities/dataLogEntity";

jest.mock("../../dataProviders/db/data-log/dataLog.port");
jest.mock("./dataLog.adapter");

describe("dataLogService", () => {
    const FILE_PATH = "/path/to/file.csv";
    const EDITION_DATE = new Date("2022-02-02");
    const DEFAULT_DATA_LOG_INFO: Omit<FileDataLogEntity, "integrationDate" | "source"> = {
        providerId: RAW_PROVIDER.meta.id,
        providerName: RAW_PROVIDER.meta.name,
        fileName: FILE_PATH,
        editionDate: EDITION_DATE,
        userId: "user-123",
    };

    describe("add", () => {
        const FILE_DATA_LOG: Omit<FileDataLogEntity, "integrationDate"> = {
            ...DEFAULT_DATA_LOG_INFO,
            source: DataLogSource.FILE,
        };
        let mockThrowMissingProp: jest.SpyInstance;
        beforeAll(() => {
            mockThrowMissingProp = jest.spyOn(dataLogService, "throwMissingProp").mockImplementation(() => {
                throw new Error();
            });
        });

        afterAll(() => {
            mockThrowMissingProp.mockRestore();
        });

        it.each`
            missingProp
            ${"providerId"}
            ${"providerName"}
        `("throws if $missingProp is missing", async ({ missingProp }) => {
            const INVALID_LOG = { ...FILE_DATA_LOG, [missingProp]: undefined };
            await expect(async () => dataLogService.add(INVALID_LOG)).rejects.toThrow();
        });

        it("inserts log", async () => {
            const DATE_NOW = new Date("2024-04-04");
            jest.useFakeTimers().setSystemTime(DATE_NOW);
            await dataLogService.add(FILE_DATA_LOG);
            expect(dataLogPort.insert).toHaveBeenCalledWith({ ...FILE_DATA_LOG, integrationDate: DATE_NOW });
            jest.useRealTimers();
        });

        it("returns inserted log", async () => {
            await dataLogService.add(FILE_DATA_LOG);
            const actual = jest.mocked(dataLogPort.insert).mock.calls[0][0];
            expect(actual).toMatchSnapshot({ integrationDate: expect.any(Date) });
        });
    });

    describe("addFromFile", () => {
        let mockAdd: jest.SpyInstance;
        beforeAll(() => {
            mockAdd = jest.spyOn(dataLogService, "add").mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockAdd.mockRestore();
        });

        it("throws if fileName is missing", async () => {
            // @ts-expect-error: test guard
            await expect(() => dataLogService.addFromFile({ ...DEFAULT_DATA_LOG_INFO, fileName: undefined })).toThrow(
                "DataLogEntity from file must have a fileName",
            );
        });

        it("only keeps file name if given fileName is a path", async () => {
            const expected = "file.csv";
            await dataLogService.addFromFile(DEFAULT_DATA_LOG_INFO);
            const actual = mockAdd.mock.calls[0][0].fileName;
            expect(actual).toBe(expected);
        });

        it("calls add", async () => {
            await dataLogService.addFromFile(DEFAULT_DATA_LOG_INFO);
            expect(mockAdd).toHaveBeenCalledWith({
                ...DEFAULT_DATA_LOG_INFO,
                fileName: "file.csv",
                source: DataLogSource.FILE,
            });
        });

        it("returns inserted log", async () => {
            const expected = { ...DEFAULT_DATA_LOG_INFO, integrationDate: expect.any(Date) };
            mockAdd.mockResolvedValueOnce(expected);
            const actual = await dataLogService.addFromFile(DEFAULT_DATA_LOG_INFO);
            expect(actual).toEqual(expected);
        });
    });

    describe("addFromApi", () => {
        const { userId, fileName, ...partialDataLog } = DEFAULT_DATA_LOG_INFO;
        const API_DATA_LOG: Omit<ApiDataLogEntity, "integrationDate"> = {
            ...partialDataLog,
            source: DataLogSource.API,
        };
        let mockAdd: jest.SpyInstance;
        beforeAll(() => {
            mockAdd = jest.spyOn(dataLogService, "add").mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockAdd.mockRestore();
        });

        it("throws if fileName is present", async () => {
            await expect(() => dataLogService.addFromApi(DEFAULT_DATA_LOG_INFO)).toThrow(
                "DataLogEntity from API can't have a fileName",
            );
        });

        it("calls add", async () => {
            await dataLogService.addFromApi(API_DATA_LOG);
            expect(mockAdd).toHaveBeenCalledWith({ ...API_DATA_LOG, source: DataLogSource.API });
        });

        it("returns inserted log", async () => {
            const expected = { ...API_DATA_LOG, integrationDate: expect.any(Date) };
            mockAdd.mockResolvedValueOnce(expected);
            const actual = await dataLogService.addFromApi(API_DATA_LOG);
            expect(actual).toEqual(expected);
        });
    });

    describe("getProvidersLogOverview", () => {
        beforeAll(() => {
            // @ts-expect-error -- mock
            jest.mocked(dataLogPort.getProvidersLogOverview).mockResolvedValue([1, 2, 3]);
        });

        afterAll(() => {
            jest.mocked(dataLogPort.getProvidersLogOverview).mockRestore();
        });

        it("gets data from port", async () => {
            await dataLogService.getProvidersLogOverview();
            expect(dataLogPort.getProvidersLogOverview).toHaveBeenCalled();
        });

        it("adapts each log", async () => {
            await dataLogService.getProvidersLogOverview();
            expect(DataLogAdapter.overviewToDto).toHaveBeenCalledTimes(3);
        });

        it("returns adapted value", async () => {
            // @ts-expect-error -- test
            jest.mocked(DataLogAdapter.overviewToDto).mockImplementation(v => v.toString());
            const expected = ["1", "2", "3"];
            const actual = await dataLogService.getProvidersLogOverview();
            expect(actual).toEqual(expected);
        });
    });
});
