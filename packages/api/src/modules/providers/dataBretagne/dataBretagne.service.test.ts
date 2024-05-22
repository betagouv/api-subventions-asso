import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
jest.mock("../../../dataProviders/db/state-budget-program/stateBudgetProgram.port");
import { PROGRAMS } from "../../../dataProviders/api/dataBretagne/__fixtures__/DataBretagne.fixture";
import ProgrammeAdapter from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.adapter";
jest.mock("../../../dataProviders/db/state-budget-program/stateBudgetProgram.adapter");

describe("Data Bretagne Service", () => {
    beforeAll(() => {
        jest.mocked(dataBretagnePort.getStateBudgetPrograms).mockResolvedValue(PROGRAMS);
    });

    describe("resyncPrograms", () => {
        it("should call dataBretagnePort.getStateBudgetPrograms", async () => {
            await dataBretagneService.resyncPrograms();
            expect(jest.mocked(dataBretagnePort.getStateBudgetPrograms)).toHaveBeenCalledTimes(1);
        });

        it("should call stateBudgetProgramPort.replace", async () => {
            await dataBretagneService.resyncPrograms();
            expect(jest.mocked(stateBudgetProgramPort).replace).toHaveBeenCalledTimes(1);
        });

        it("should call StateBudgetProgramAdapter.toDbo", async () => {
            await dataBretagneService.resyncPrograms();
            expect(jest.mocked(ProgrammeAdapter).toDbo).toHaveBeenCalledTimes(PROGRAMS.length);
        });

        it("should throw error if no program", async () => {
            jest.mocked(dataBretagnePort.getStateBudgetPrograms).mockResolvedValueOnce([]);
            expect(() => dataBretagneService.resyncPrograms()).rejects.toThrowError(
                "Unhandled error from API Data Bretagne",
            );
        });
    });
});
