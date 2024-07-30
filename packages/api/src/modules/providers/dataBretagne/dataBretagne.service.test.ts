import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
jest.mock("../../../dataProviders/db/state-budget-program/stateBudgetProgram.port");
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import { PROGRAMS } from "../../../dataProviders/api/dataBretagne/__fixtures__/DataBretagne.fixture";
import DataBretagneProgrammeAdapter from "../../../dataProviders/api/dataBretagne/DataBretagneProgrammeAdapter";
import dataLogService from "../../data-log/dataLog.service";
jest.mock("../../data-log/dataLog.service");

describe("Data Bretagne Service", () => {
    beforeAll(() => {
        jest.mocked(dataBretagnePort.getStateBudgetPrograms).mockResolvedValue([
            new StateBudgetProgramEntity("label_theme", "label", "code_ministere", 1),
        ]);
        jest.mocked(stateBudgetProgramPort.findAll).mockResolvedValue(
            PROGRAMS.map(DataBretagneProgrammeAdapter.toEntity),
        );
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

        it("logs import", async () => {
            const date = new Date("2022-01-01");
            jest.useFakeTimers().setSystemTime(date);
            await dataBretagneService.resyncPrograms();
            expect(dataLogService.addLog).toHaveBeenCalledWith("data-bretagne", date, "api");
            jest.useRealTimers();
        });
    });

    describe("findProgramsRecord", () => {
        it("should call stateBudgetProgramPort.find", async () => {
            await dataBretagneService.findProgramsRecord();
            expect(jest.mocked(stateBudgetProgramPort.findAll)).toHaveBeenCalledTimes(1);
        });

        it("should return a record of state budget program entities", async () => {
            const programs = await dataBretagneService.findProgramsRecord();
            expect(programs).toEqual({
                [PROGRAMS[0].code]: DataBretagneProgrammeAdapter.toEntity(PROGRAMS[0]),
            });
        });
    });
});
