import dataLogService from "./dataLog.service";
import dataLogPort from "../../dataProviders/db/data-log/dataLog.port";
import { DataLogAdapter } from "./dataLog.adapter";

jest.mock("../../dataProviders/db/data-log/dataLog.port");
jest.mock("./dataLog.adapter");

describe("dataLogService", () => {
    describe("addLog", () => {
        const PROVIDER_ID = "PROVIDER_ID";
        const EDITION_DATE = new Date("2022-02-02");
        const FILE_PATH = "/path/to/file.csv";

        it("inserts log", async () => {
            await dataLogService.addLog(PROVIDER_ID, FILE_PATH, EDITION_DATE);
            expect(dataLogPort.insert).toHaveBeenCalled();
        });

        it("inserts log", async () => {
            await dataLogService.addLog(PROVIDER_ID, FILE_PATH, EDITION_DATE);
            const actual = jest.mocked(dataLogPort.insert).mock.calls[0][0];
            expect(actual).toMatchObject({
                providerId: PROVIDER_ID,
                editionDate: EDITION_DATE,
            });
        });

        it("set integration date to now", async () => {
            const DATE_NOW = new Date("2024-04-04");
            jest.useFakeTimers().setSystemTime(DATE_NOW);
            await dataLogService.addLog(PROVIDER_ID, FILE_PATH, EDITION_DATE);
            const arg = jest.mocked(dataLogPort.insert).mock.calls[0][0];
            const expected = DATE_NOW;
            const actual = arg.integrationDate;
            expect(actual).toEqual(expected);
            jest.useRealTimers();
        });

        it("sets fileName from file path", async () => {
            const expected = "file.csv";
            await dataLogService.addLog(PROVIDER_ID, FILE_PATH, EDITION_DATE);
            const arg = jest.mocked(dataLogPort.insert).mock.calls[0][0];
            const actual = arg.fileName;
            expect(actual).toBe(expected);
        });

        it("returns res from provider", async () => {
            const expected = "RES";
            // @ts-expect-error mock
            jest.mocked(dataLogPort.insert).mockResolvedValueOnce(expected);
            const actual = await dataLogService.addLog(PROVIDER_ID, FILE_PATH, EDITION_DATE);
            expect(actual).toBe(expected);
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
