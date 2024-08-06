import dataBretagneService from "./dataBretagne.service";
import dataBretagnePort, { DataBretagnePort } from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
jest.mock("../../../dataProviders/api/dataBretagne/dataBretagne.port");
import stateBudgetProgramPort from "../../../dataProviders/db/state-budget-program/stateBudgetProgram.port";
jest.mock("../../../dataProviders/db/state-budget-program/stateBudgetProgram.port");
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import { PROGRAMS } from "../../../dataProviders/api/dataBretagne/__fixtures__/DataBretagne.fixture";
import { DataBretagneProgrammeAdapter } from "../../../dataProviders/api/dataBretagne/DataBretagneAdapter";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import dataLogService from "../../data-log/dataLog.service";
jest.mock("../../data-log/dataLog.service");

const entities = {
    getDomaineFonctionnel: [
        {
            code_action: "code",
            code_programme: 163,
            libelle_action: "Label",
        },
    ] as DomaineFonctionnelEntity[],

    getMinistry: [
        {
            code_ministere: "code",
            nom_ministere: "label",
            sigle_ministere: "sigle_ministere",
        },
    ] as MinistryEntity[],

    getRefProgrammation: [
        {
            code_activite: "code",
            code_programme: 162,
            libelle_activite: "label",
        },
    ] as RefProgrammationEntity[],
};

const expected = {
    getDomaineFonctionnel: { [entities.getDomaineFonctionnel[0].code_action]: entities.getDomaineFonctionnel[0] },
    getMinistry: { [entities.getMinistry[0].code_ministere]: entities.getMinistry[0] },
    getRefProgrammation: { [entities.getRefProgrammation[0].code_activite]: entities.getRefProgrammation[0] },
};

describe("Data Bretagne Service", function () {
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

    describe.each([
        [async () => dataBretagneService.getMinistriesRecord(), "getMinistry"],
        [async () => dataBretagneService.getDomaineFonctRecord(), "getDomaineFonctionnel"],
        [async () => dataBretagneService.getRefProgrammationRecord(), "getRefProgrammation"],
    ])("with %s", (methodToTest, methodToMock) => {
        let mockLogin: jest.SpyInstance;
        let mockGetEntities: jest.SpyInstance;

        beforeEach(() => {
            mockLogin = jest.spyOn(dataBretagnePort, "login").mockResolvedValue();
            mockGetEntities = jest
                .spyOn(dataBretagnePort, methodToMock as keyof DataBretagnePort)
                .mockResolvedValue(entities[methodToMock]);
        });

        afterAll(() => {
            mockLogin.mockRestore();
            mockGetEntities.mockRestore();
        });

        it("should call login", async () => {
            await methodToTest();
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });

        it("should call getEntities", async () => {
            await methodToTest();
            expect(mockGetEntities).toHaveBeenCalledTimes(1);
        });

        it("should return a record of entities", async () => {
            const result = await methodToTest();
            expect(result).toEqual(expected[methodToMock]);
        });
    });
});
