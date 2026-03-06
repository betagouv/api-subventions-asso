import { DumpService } from "./dump.service";
import metabaseDumpPort from "../../dataProviders/db/dump/metabase-dump.port";
import userCrudService from "../user/services/crud/user.crud.service";
import { DEPOSIT_LOG_ENTITY } from "../deposit-scdl-process/__fixtures__/depositLog.fixture";
import { USER_DBO } from "../user/__fixtures__/user.fixture";
import { createDepositScdlProcessService } from "../../../tests/__mocks__/deposit-log/deposit-scdl-process.service.mock";

jest.mock("../deposit-scdl-process/depositScdlProcess.service");
jest.mock("../user/services/crud/user.crud.service");
jest.mock("../../dataProviders/db/dump/metabase-dump.port");
jest.mock("../configurations/configurations.service");
jest.mock("../stats/stats.service", () => ({
    getAnonymizedLogsOnPeriod: jest.fn((..._args) => ({ hasNext: jest.fn(() => false) })),
    getAssociationsVisitsOnPeriod: jest.fn(() => []),
}));
jest.mock("../../configurations/env.conf", () => ({
    ENV: "prod", // needed because else publishStatsData does nothing
}));

describe("dumpService", () => {
    const mockDepositScdlProcessService = createDepositScdlProcessService();
    let dumpService: DumpService;

    beforeEach(() => {
        dumpService = new DumpService(mockDepositScdlProcessService);
    });

    describe("patchWithPipedriveData", () => {
        it("calls port", () => {
            // @ts-expect-error -- test private
            dumpService.patchWithPipedriveData();
            expect(metabaseDumpPort.patchWithPipedriveData).toHaveBeenCalled();
        });
    });

    describe("importPipedriveData", () => {
        it("calls port with arg", () => {
            dumpService.importPipedriveData([]);
            expect(metabaseDumpPort.savePipedrive).toHaveBeenCalledWith([]);
        });
    });

    describe("publishStatsData", () => {
        let mockPatchWithPipedriveData: jest.SpyInstance;
        const DEPOSIT_LOGS = [DEPOSIT_LOG_ENTITY];
        const USERS = [USER_DBO];

        beforeEach(() => {
            mockPatchWithPipedriveData = jest
                // @ts-expect-error -- test private method
                .spyOn(dumpService, "patchWithPipedriveData");

            mockPatchWithPipedriveData.mockImplementation(jest.fn());
            mockDepositScdlProcessService.findAll.mockResolvedValue(DEPOSIT_LOGS);
            jest.mocked(userCrudService.find).mockResolvedValue(USERS);
        });

        it("patches users with pipedrive", async () => {
            await dumpService.publishStatsData();
            expect(mockPatchWithPipedriveData).toHaveBeenCalled();
        });

        it("publish deposit logs", async () => {
            await dumpService.publishStatsData();
            expect(metabaseDumpPort.upsertDepositLogs).toHaveBeenCalledWith(DEPOSIT_LOGS);
        });

        it("publish data logs", async () => {
            await dumpService.publishStatsData();
            expect(metabaseDumpPort.upsertDataLog).toHaveBeenCalled();
        });
    });
});
