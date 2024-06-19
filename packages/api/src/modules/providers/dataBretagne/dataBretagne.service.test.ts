import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
jest.mock("../../../dataProviders/db/state-budget-program/stateBudgetProgram.port");
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";

describe("Data Bretagne Service", () => {
    beforeAll(() => {
        jest.mocked(dataBretagnePort.getStateBudgetPrograms).mockResolvedValue([new StateBudgetProgramEntity(
            "label_theme",
            "label",
            "code_ministere",
            1,
        )]);
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

        it("should throw error if no program", async () => {
            jest.mocked(dataBretagnePort.getStateBudgetPrograms).mockResolvedValueOnce([]);
            expect(() => dataBretagneService.resyncPrograms()).rejects.toThrowError(
                "Unhandled error from API Data Bretagne",
            );
        });
    });

    describe("findPrograms", () => {
        it("should call stateBudgetProgramPort.findAll", async () => {
            const findAllSpy = jest.spyOn(stateBudgetProgramPort, "findAll").mockResolvedValueOnce([]);
            await dataBretagneService.findPrograms();
            expect(findAllSpy).toHaveBeenCalledTimes(1);
        });
    });
});
