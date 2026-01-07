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
import { DATA_BRETAGNE_RECORDS, PROGRAM_ENTITIES } from "./__fixtures__/dataBretagne.fixture";
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
            expect(dataLogService.addFromApi).toHaveBeenCalledWith({
                providerId: dataBretagneService.meta.id,
                providerName: dataBretagneService.meta.name,
                editionDate: date,
            });
            jest.useRealTimers();
        });
    });

    describe("getAllDataRecords", () => {
        const mockLogin = jest.spyOn(dataBretagnePort, "login").mockImplementation(jest.fn());
        const mockGetProgramsRecord = jest.spyOn(dataBretagneService, "getProgramsRecord");
        const mockGetMinistriesRecord = jest.spyOn(dataBretagneService, "getMinistriesRecord");
        const mockGetProgramsRefRecord = jest.spyOn(dataBretagneService, "getProgramsRefRecord");
        const mockGetFonctionalDomainsRecord = jest.spyOn(dataBretagneService, "getFonctionalDomainsRecord");

        beforeAll(() => {
            mockGetProgramsRecord.mockResolvedValue(DATA_BRETAGNE_RECORDS.programs);
            mockGetMinistriesRecord.mockResolvedValue(DATA_BRETAGNE_RECORDS.ministries);
            mockGetProgramsRefRecord.mockResolvedValue(DATA_BRETAGNE_RECORDS.programsRef);
            mockGetFonctionalDomainsRecord.mockResolvedValue(DATA_BRETAGNE_RECORDS.fonctionalDomains);
        });

        afterAll(() => {
            [
                mockGetFonctionalDomainsRecord,
                mockGetProgramsRecord,
                mockGetMinistriesRecord,
                mockGetProgramsRefRecord,
            ].map(mock => mock.mockRestore());
        });

        it("should log in", async () => {
            await dataBretagneService.getAllDataRecords();
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });

        it("should return all data from dataBretagneService", async () => {
            const result = await dataBretagneService.getAllDataRecords();
            const expected = DATA_BRETAGNE_RECORDS;
            expect(result).toEqual(expected);
        });

        it.each(["getMinistriesRecord", "getProgramsRecord", "getFonctionalDomainsRecord", "getProgramsRefRecord"])(
            "should call %s",
            async methodName => {
                await dataBretagneService.getAllDataRecords();
                expect(dataBretagneService[methodName]).toHaveBeenCalledTimes(1);
            },
        );
    });

    describe("getProgramsRecord", () => {
        it("should call stateBudgetProgramPort.find", async () => {
            await dataBretagneService.getProgramsRecord();
            expect(jest.mocked(stateBudgetProgramPort.findAll)).toHaveBeenCalledTimes(1);
        });

        it("should return a record of state budget program entities", async () => {
            const programs = await dataBretagneService.getProgramsRecord();
            expect(programs).toEqual({
                [PROGRAMS[0].code]: DataBretagneProgrammeAdapter.toEntity(PROGRAMS[0]),
            });
        });
    });

    describe.each([
        [async () => dataBretagneService.getMinistriesRecord(), "getMinistry"],
        [async () => dataBretagneService.getFonctionalDomainsRecord(), "getDomaineFonctionnel"],
        [async () => dataBretagneService.getProgramsRefRecord(), "getRefProgrammation"],
    ])("with %s", (methodToTest, methodToMock) => {
        let mockGetEntities: jest.SpyInstance;

        beforeEach(() => {
            mockGetEntities = jest
                .spyOn(dataBretagnePort, methodToMock as keyof DataBretagnePort)
                .mockResolvedValue(entities[methodToMock]);
        });

        afterAll(() => {
            mockGetEntities.mockRestore();
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

    describe("getMinistryEntity", () => {
        const mockConsoleError = jest.spyOn(console, "error");

        beforeAll(() => {
            mockConsoleError.mockImplementation();
        });

        afterAll(() => mockConsoleError.mockRestore());

        it("return a MinistryEntity", () => {
            const expected = DATA_BRETAGNE_RECORDS.ministries[PROGRAM_ENTITIES[0].code_ministere];
            const actual = dataBretagneService.getMinistryEntity(PROGRAM_ENTITIES[0], DATA_BRETAGNE_RECORDS.ministries);
            expect(actual).toEqual(expected);
        });

        it("returns null if the program doesn't match any ministry", () => {
            const expected = null;
            const actual = dataBretagneService.getMinistryEntity(
                { code_ministere: "NO_MIN" } as StateBudgetProgramEntity,
                DATA_BRETAGNE_RECORDS.ministries,
            );
            expect(actual).toEqual(expected);
        });
        it("logs error if the program doesn't match any ministry", () => {
            const PROGRAM = { code_ministere: "NO_MIN" } as StateBudgetProgramEntity;
            dataBretagneService.getMinistryEntity(PROGRAM, DATA_BRETAGNE_RECORDS.ministries);
            expect(mockConsoleError).toHaveBeenCalledWith(
                `Ministry not found for program code: ${PROGRAM.code_ministere}`,
            );
        });
    });
});
