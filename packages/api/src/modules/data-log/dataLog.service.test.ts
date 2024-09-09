import dataLogService from "./dataLog.service";
import dataLogRepository from "./repositories/dataLog.repository";
import { DataLogAdapter } from "./dataLog.adapter";

jest.mock("./repositories/dataLog.repository");
jest.mock("./dataLog.adapter");

describe("dataLogService", () => {
    describe("addLog", () => {
        const PROVIDER_ID = "PROVIDER_ID";
        const EDITION_DATE = new Date("2022-02-02");
        const FILE_PATH = "/path/to/file.csv";

        it("inserts log", async () => {
            await dataLogService.addLog(PROVIDER_ID, EDITION_DATE, FILE_PATH);
            expect(dataLogRepository.insert).toHaveBeenCalled();
        });

        it("inserts log", async () => {
            await dataLogService.addLog(PROVIDER_ID, EDITION_DATE, FILE_PATH);
            const actual = jest.mocked(dataLogRepository.insert).mock.calls[0][0];
            expect(actual).toMatchObject({
                providerId: PROVIDER_ID,
                editionDate: EDITION_DATE,
            });
        });

        it("set integration date to now", async () => {
            const DATE_NOW = new Date("2024-04-04");
            jest.useFakeTimers().setSystemTime(DATE_NOW);
            await dataLogService.addLog(PROVIDER_ID, EDITION_DATE, FILE_PATH);
            const arg = jest.mocked(dataLogRepository.insert).mock.calls[0][0];
            const expected = DATE_NOW;
            const actual = arg.integrationDate;
            expect(actual).toEqual(expected);
            jest.useRealTimers();
        });

        it("sets fileName from file path", async () => {
            const expected = "file.csv";
            await dataLogService.addLog(PROVIDER_ID, EDITION_DATE, FILE_PATH);
            const arg = jest.mocked(dataLogRepository.insert).mock.calls[0][0];
            const actual = arg.fileName;
            expect(actual).toBe(expected);
        });

        it("returns res from provider", async () => {
            const expected = "RES";
            // @ts-expect-error mock
            jest.mocked(dataLogRepository.insert).mockResolvedValueOnce(expected);
            const actual = await dataLogService.addLog(PROVIDER_ID, EDITION_DATE, FILE_PATH);
            expect(actual).toBe(expected);
        });
    });

    describe("findLastByProvider", () => {
        beforeAll(() => {
            // @ts-expect-error -- mock
            jest.mocked(dataLogRepository.findLastByProvider).mockResolvedValue([1, 2, 3]);
        });

        afterAll(() => {
            jest.mocked(dataLogRepository.findLastByProvider).mockRestore();
        });

        it("gets data from repo", async () => {
            await dataLogService.findLastByProvider();
            expect(dataLogRepository.findLastByProvider).toHaveBeenCalled();
        });

        it("adapts each log", async () => {
            await dataLogService.findLastByProvider();
            expect(DataLogAdapter.entityToDto).toHaveBeenCalledTimes(3);
        });

        it("returns adapted value", async () => {
            // @ts-expect-error -- test
            jest.mocked(DataLogAdapter.entityToDto).mockImplementation(v => v.toString());
            const expected = ["1", "2", "3"];
            const actual = await dataLogService.findLastByProvider();
            expect(actual).toEqual(expected);
        });
    });
});
