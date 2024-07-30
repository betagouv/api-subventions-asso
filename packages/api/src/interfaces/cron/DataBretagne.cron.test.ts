import dataBretagneService from "../../modules/providers/dataBretagne/dataBretagne.service";
import { DataBretagneCron } from "./DataBretagne.cron";
import dataLogService from "../../modules/data-log/dataLog.service";

jest.mock("../../modules/providers/dataBretagne/dataBretagne.service", () => ({
    resyncPrograms: jest.fn(),
    provider: { id: "mockedId" },
}));
jest.mock("../../modules/data-log/dataLog.service");

describe("DataBretagne Cron", () => {
    // TODO test that it saves import log
    describe("resync", () => {
        it("should call dataBretagneService.resyncPrograms()", async () => {
            const cron = new DataBretagneCron();
            await cron.resync();
            expect(dataBretagneService.resyncPrograms).toHaveBeenCalledTimes(1);
        });

        it("logs import", async () => {
            const date = new Date("2022-01-01");
            jest.useFakeTimers().setSystemTime(date);
            const cron = new DataBretagneCron();
            await cron.resync();
            expect(dataLogService.addLog).toHaveBeenCalledWith("mockedId", date, "api");
            jest.useRealTimers();
        });
    });
});
