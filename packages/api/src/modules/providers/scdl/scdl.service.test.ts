import scdlService from "./scdl.service";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";

jest.mock("fs");

jest.mock("../../../dataProviders/db/providers/scdl/miscScdlGrant.port");
import miscScdlProducersPort from "../../../dataProviders/db/providers/scdl/miscScdlProducers.port";

jest.mock("../../../dataProviders/db/providers/scdl/miscScdlProducers.port");
import { getMD5 } from "../../../shared/helpers/StringHelper";

jest.mock("../../../shared/helpers/StringHelper");
jest.mock("./scdl.grant.parser");

import MiscScdlGrantFixture, { MISC_SCDL_GRANT_DBO_FIXTURE } from "./__fixtures__/MiscScdlGrant";
import PRODUCER_FIXTURE from "./__fixtures__/MiscScdlProducer";
import ScdlGrantParser from "./scdl.grant.parser";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import applicationFlatPort from "../../../dataProviders/db/applicationFlat/applicationFlat.port";
import apiAssoService from "../apiAsso/apiAsso.service";
import Siret from "../../../identifierObjects/Siret";
import fs from "fs";
import { ObjectId } from "mongodb";
import scdlGrantService from "./scdl.grant.service";
import { DuplicateIndexError } from "../../../shared/errors/dbError/DuplicateIndexError";
import { ScdlParsedInfos } from "./@types/ScdlParsedInfos";

const mockedFs = jest.mocked(fs);

jest.mock("../../../dataProviders/db/applicationFlat/applicationFlat.port");
jest.mock("../apiAsso/apiAsso.service");

describe("ScdlService", () => {
    const UNIQUE_ID = "UNIQUE_ID";
    const PRODUCER = { ...PRODUCER_FIXTURE };
    const PRODUCER_SIRET = PRODUCER.siret;
    const MOST_RECENT_EXERCISE = 2024;
    const LAST_EXERCISE_GRANTS: ScdlGrantDbo[] = [
        { ...MISC_SCDL_GRANT_DBO_FIXTURE, exercice: MOST_RECENT_EXERCISE, _id: "6836ef39067ffc959c9b5ee8" },
        {
            ...MISC_SCDL_GRANT_DBO_FIXTURE,
            amount: 23500,
            exercice: MOST_RECENT_EXERCISE,
            _id: "683d4e224f4d135f42137e3c",
        },
    ];
    const GRANTS_DBO_ARRAY = [MISC_SCDL_GRANT_DBO_FIXTURE, ...LAST_EXERCISE_GRANTS];

    const PRODUCER_ENTITY = {
        _id: new ObjectId(),
        ...PRODUCER_FIXTURE,
    };
    const FILE_CONTENT = Buffer.from("FILE_CONTENT");
    const GRANT = { ...MiscScdlGrantFixture };
    const STORABLE_DATA = { ...GRANT, __data__: {} };
    const STORABLE_DATA_ARRAY = [STORABLE_DATA];
    const DBO: ScdlGrantDbo = { ...GRANT, __data__: {}, _id: "prov-toto" };
    const DBOS: ScdlGrantDbo[] = [DBO];

    beforeEach(() => {
        mockedFs.readFileSync.mockReturnValue(FILE_CONTENT);
    });

    describe("getProvider()", () => {
        it("should call miscScdlProducersPort.create()", async () => {
            await scdlService.getProducer(new Siret(PRODUCER.siret));
            expect(miscScdlProducersPort.findBySiret).toHaveBeenCalledWith(PRODUCER.siret);
        });
    });

    describe("getProducers", () => {
        it("should call findAll", async () => {
            await scdlService.getProducers();
            expect(miscScdlProducersPort.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("createProducer()", () => {
        it("should call miscScdlProducersPort.create()", async () => {
            jest.spyOn(apiAssoService, "findAssociationBySiren").mockResolvedValueOnce({
                // @ts-expect-error: mock provider value
                denomination_siren: [{ value: PRODUCER.name }],
            });
            await scdlService.createProducer(new Siret(PRODUCER.siret));
            expect(miscScdlProducersPort.create).toHaveBeenCalledWith(PRODUCER);
        });
    });

    describe("_buildGrantUniqueId()", () => {
        it("should call getMD5()", async () => {
            const DATA = {};
            // @ts-expect-error: call private method
            await scdlService._buildGrantUniqueId({ __data__: DATA }, PRODUCER.siret);
            expect(jest.mocked(getMD5)).toHaveBeenCalledWith(`${PRODUCER.siret}-${JSON.stringify(DATA)}`);
        });
    });

    describe("buildDbosFromStorables()", () => {
        let mockBuildGrantUniqueId: jest.SpyInstance;
        let mockGetProducer: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: private method
            mockBuildGrantUniqueId = jest.spyOn(scdlService, "_buildGrantUniqueId").mockReturnValue(UNIQUE_ID);
            // @ts-expect-error: mock - omit _id
            mockGetProducer = jest.spyOn(scdlService, "getProducer").mockResolvedValue(PRODUCER);
        });

        afterEach(() => {
            mockBuildGrantUniqueId.mockReset();
            mockGetProducer.mockReset();
        });

        afterAll(() => {
            mockBuildGrantUniqueId.mockRestore();
            mockGetProducer.mockRestore();
        });

        it("should call _buildGrantUniqueId()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.buildDbosFromStorables(GRANTS, PRODUCER);
            expect(mockBuildGrantUniqueId).toHaveBeenCalledWith(GRANTS[0], PRODUCER.siret);
        });

        it("returns data with allocator data from producer", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            const expected = [
                {
                    ...GRANTS[0],
                    _id: UNIQUE_ID,
                    allocatorName: PRODUCER.name,
                    allocatorSiret: PRODUCER.siret,
                },
            ];
            const actual = await scdlService.buildDbosFromStorables(GRANTS, PRODUCER);
            expect(actual).toEqual(expected);
        });
    });

    describe("saveDbos()", () => {
        let mockBuildGrantUniqueId: jest.SpyInstance;
        let mockGetProducer: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: private method
            mockBuildGrantUniqueId = jest.spyOn(scdlService, "_buildGrantUniqueId").mockReturnValue(UNIQUE_ID);
            // @ts-expect-error: mock - omit _id
            mockGetProducer = jest.spyOn(scdlService, "getProducer").mockResolvedValue(PRODUCER);
        });

        afterEach(() => {
            mockBuildGrantUniqueId.mockReset();
            mockGetProducer.mockReset();
        });

        afterAll(() => {
            mockBuildGrantUniqueId.mockRestore();
            mockGetProducer.mockRestore();
        });

        it("should call miscScdlGrantPort.createMany with allocator data from grant", async () => {
            const GRANTS = "DBOS" as unknown as ScdlGrantDbo[];
            await scdlService.saveDbos(GRANTS);
            expect(miscScdlGrantPort.createMany).toHaveBeenCalledWith(GRANTS);
        });
    });

    describe.each`
        service       | parser                        | args
        ${"parseCsv"} | ${ScdlGrantParser.parseCsv}   | ${[",", "'"]}
        ${"parseXls"} | ${ScdlGrantParser.parseExcel} | ${["page", 2]}
    `("parser boilerplate $service", ({ service, parser, args }) => {
        const FILE_CONTENT = Buffer.from("toto");
        const RES = { errors: [], entities: [] };
        let mockNormalizeErrors: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error: mock method
            mockNormalizeErrors = jest.spyOn(scdlService, "normalizeErrors").mockImplementation(errors => errors);
            jest.mocked(parser).mockReturnValue(RES);
        });

        afterAll(() => {
            jest.mocked(parser).mockRestore();
            mockNormalizeErrors.mockRestore();
        });

        it("calls parser with given args", () => {
            scdlService[service](FILE_CONTENT, ...args);
            expect(parser).toHaveBeenCalledWith(FILE_CONTENT, ...args);
        });

        it("normalizes errors", () => {
            scdlService[service](FILE_CONTENT, ...args);
            expect(mockNormalizeErrors).toHaveBeenCalledWith(RES.errors);
        });

        it("returns res from parser", () => {
            const expected = RES;
            const actual = scdlService[service](FILE_CONTENT, ...args);
            expect(actual).toEqual(expected);
        });
    });

    describe("isProducerFirstImport", () => {
        it("calls miscScdlGrantPort.findOneByAllocatorSiret()", async () => {
            // @ts-expect-error: mock return value
            jest.mocked(miscScdlGrantPort.findOneByAllocatorSiret).mockResolvedValue({} as MiscScdlGrantEntity);
            await scdlService.isProducerFirstImport(PRODUCER_SIRET);
            expect(miscScdlGrantPort.findOneByAllocatorSiret).toHaveBeenCalledWith(PRODUCER_SIRET);
        });

        it("returns false if data already in db for the given producer SIRET", async () => {
            jest.mocked(miscScdlGrantPort.findOneByAllocatorSiret).mockResolvedValue({} as ScdlGrantDbo);
            const actual = await scdlService.isProducerFirstImport(PRODUCER_SIRET);
            expect(actual).toEqual(false);
        });

        it.each`
            expected | mockReturnValue
            ${true}  | ${undefined}
            ${true}  | ${null}
        `("returns $expected with $mockReturnValue", async ({ expected, mockReturnValue }) => {
            jest.mocked(miscScdlGrantPort.findOneByAllocatorSiret).mockResolvedValue(mockReturnValue);
            const actual = await scdlService.isProducerFirstImport(PRODUCER_SIRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("validateImportCoverage", () => {
        it.each`
            entities                                                                                        | documents                                                                                                           | exerciseWithError
            ${[{ exercice: 2023 }]}                                                                         | ${[{ exercice: 2023 }, { exercice: 2023 }]}                                                                         | ${2023}
            ${[{ exercice: 2023 }, { exercice: MOST_RECENT_EXERCISE }, { exercice: MOST_RECENT_EXERCISE }]} | ${[{ exercice: 2023 }, { exercice: 2023 }, { exercice: MOST_RECENT_EXERCISE }, { exercice: MOST_RECENT_EXERCISE }]} | ${2023}
            ${[{ exercice: 2023 }, { exercice: 2023 }, { exercice: MOST_RECENT_EXERCISE }]}                 | ${[{ exercice: 2023 }, { exercice: 2023 }, { exercice: MOST_RECENT_EXERCISE }, { exercice: MOST_RECENT_EXERCISE }]} | ${MOST_RECENT_EXERCISE}
        `("throws if less data in import file than in database", async ({ entities, documents, exerciseWithError }) => {
            await expect(
                async () =>
                    await scdlService.validateImportCoverage(
                        PRODUCER.siret,
                        entities.map(entity => entity.exercice),
                        entities,
                        documents,
                    ),
            ).rejects.toThrow(
                `You are trying to import less grants for exercise ${exerciseWithError} than what already exist in the database for producer's SIRET ${PRODUCER.siret}.`,
            );
        });
    });

    describe("getGrantsOnPeriodByAllocator", () => {
        const EXERCISES = [2025];

        it("calls miscScdlGrantPort.findByAllocatorOnPeriod()", async () => {
            await scdlService.getGrantsOnPeriodByAllocator(PRODUCER.siret, [2025]);
            expect(miscScdlGrantPort.findByAllocatorOnPeriod).toHaveBeenCalledWith(PRODUCER.siret, EXERCISES);
        });
    });

    describe("cleanExercises", () => {
        const EXERCISES = [2022, 2023, 2024];

        beforeAll(() => {
            miscScdlGrantPort.findByAllocatorOnPeriod = jest.fn().mockResolvedValue(GRANTS_DBO_ARRAY);
        });

        it("creates backup for provider's data", async () => {
            await scdlService.cleanExercises(PRODUCER.siret, EXERCISES);
            expect(miscScdlGrantPort.createBackupCollection).toHaveBeenCalledWith(PRODUCER_SIRET);
        });

        it("delete provider's data for given exercises", async () => {
            await scdlService.cleanExercises(PRODUCER.siret, EXERCISES);
            expect(miscScdlGrantPort.bulkFindDeleteByExercices).toHaveBeenCalledWith(PRODUCER.siret, EXERCISES);
        });

        it("applies backup for scdl if bulkFindDeleteByExercices throws an error", async () => {
            jest.mocked(miscScdlGrantPort).bulkFindDeleteByExercices.mockRejectedValueOnce(
                new Error("Bulk delete failed"),
            );
            await scdlService.cleanExercises(PRODUCER.siret, EXERCISES);
            expect(miscScdlGrantPort.applyBackupCollection).toHaveBeenCalledWith(PRODUCER_SIRET);
        });

        it("applies backup for applicationFlat if bulkFindDeleteByExercices throws an error", async () => {
            jest.mocked(miscScdlGrantPort).bulkFindDeleteByExercices.mockRejectedValueOnce(
                new Error("Bulk delete failed"),
            );
            await scdlService.cleanExercises(PRODUCER.siret, EXERCISES);
            expect(applicationFlatPort.applyBackupCollection).toHaveBeenCalledWith(`scdl-${PRODUCER_SIRET}`);
        });
    });

    describe("dropBackup", () => {
        it("calls dropBackupCollection for scdl", async () => {
            await scdlService.dropBackup();
            expect(miscScdlGrantPort.dropBackupCollection).toHaveBeenCalledTimes(1);
        });

        it("calls dropBackupCollection for applicationFlat", async () => {
            await scdlService.dropBackup();
            expect(applicationFlatPort.dropBackupCollection).toHaveBeenCalledTimes(1);
        });
    });

    describe("restoreBackup", () => {
        it("calls applyBackupCollection for scdl", async () => {
            await scdlService.restoreBackup(PRODUCER_SIRET);
            expect(miscScdlGrantPort.applyBackupCollection).toHaveBeenCalledWith(PRODUCER_SIRET);
        });

        it("calls applyBackupCollection for applicationFlat", async () => {
            await scdlService.restoreBackup(PRODUCER_SIRET);
            expect(applicationFlatPort.applyBackupCollection).toHaveBeenCalledWith(`scdl-${PRODUCER_SIRET}`);
        });
    });

    describe("persistEntities", () => {
        let buildDbosFromStorablesSpy: jest.SpyInstance;
        let saveDbosSpy: jest.SpyInstance;
        let saveDbosToApplicationFlatSpy: jest.SpyInstance;

        beforeEach(() => {
            buildDbosFromStorablesSpy = jest.spyOn(scdlService, "buildDbosFromStorables").mockResolvedValue(DBOS);
            saveDbosSpy = jest.spyOn(scdlService, "saveDbos").mockResolvedValue();
            saveDbosToApplicationFlatSpy = jest
                .spyOn(scdlGrantService, "saveDbosToApplicationFlat")
                .mockResolvedValue();
        });

        afterEach(() => {
            buildDbosFromStorablesSpy.mockRestore();
            saveDbosToApplicationFlatSpy.mockRestore();
            saveDbosSpy?.mockRestore();
        });

        it("should call scdlService.buildDbosFromStorables()", async () => {
            await scdlService.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
            expect(scdlService.buildDbosFromStorables).toHaveBeenCalledWith(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
        });

        it("saves in scdl collection with saveDbos", async () => {
            await scdlService.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
            expect(scdlService.saveDbos).toHaveBeenCalledWith(DBOS);
        });

        it("saves in applicationFlat", async () => {
            await scdlService.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
            expect(scdlGrantService.saveDbosToApplicationFlat).toHaveBeenCalledWith(DBOS);
        });

        it("if DuplicateIndexError arises, doesn't fail and logs", async () => {
            saveDbosSpy.mockRejectedValueOnce(new DuplicateIndexError("error", [1, 2, 3, 4, 5, 6]));
            await scdlService.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
        });

        it("if another error arises, fail and throw it again", async () => {
            const ERROR = new Error("error");
            saveDbosSpy.mockRejectedValueOnce(ERROR);
            await expect(scdlService.persistEntities(STORABLE_DATA_ARRAY, PRODUCER_ENTITY)).rejects.toThrow(ERROR);
        });
    });

    describe("persist", () => {
        const IMPORTED_DATA_EXERCISES: number[] = STORABLE_DATA_ARRAY.map(data => data.exercice);
        const GRANTS_ID_DB = [{ exercice: STORABLE_DATA_ARRAY[0].exercice } as MiscScdlGrantEntity];
        const mockCleanExercises = jest.spyOn(scdlService, "cleanExercises");
        const mockIsProducerFirstImport = jest.spyOn(scdlService, "isProducerFirstImport");
        const mockGetGrantOnPeriodByAllocator = jest.spyOn(scdlService, "getGrantsOnPeriodByAllocator");
        const mockValidateImport = jest.spyOn(scdlService, "validateImportCoverage");
        const mockRestoreBackup = jest.spyOn(scdlService, "restoreBackup");
        const mockDropBackup = jest.spyOn(scdlService, "dropBackup");
        const mockPersistEntities = jest.spyOn(scdlService, "persistEntities");

        beforeEach(() => {
            mockIsProducerFirstImport.mockResolvedValue(false);
            mockGetGrantOnPeriodByAllocator.mockResolvedValue(GRANTS_ID_DB);
            mockValidateImport.mockResolvedValue();
            mockCleanExercises.mockResolvedValue();
            mockRestoreBackup.mockResolvedValue();
            mockPersistEntities.mockResolvedValue();
        });

        it.each`
            entities
            ${undefined}
            ${[]}
        `("throws error if no entities given", async ({ entities }) => {
            await expect(async () => await scdlService.persist(PRODUCER_ENTITY, entities)).rejects.toThrow(
                "Importation failed : no entities could be created from this file",
            );
        });

        it("retrieves documents in db for imported exercices", async () => {
            await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            expect(jest.mocked(scdlService.getGrantsOnPeriodByAllocator)).toHaveBeenCalledWith(
                PRODUCER_ENTITY.siret,
                IMPORTED_DATA_EXERCISES,
            );
        });

        it("validates import", async () => {
            await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            expect(jest.mocked(scdlService.validateImportCoverage)).toHaveBeenCalledWith(
                PRODUCER_ENTITY.siret,
                [STORABLE_DATA.exercice],
                STORABLE_DATA_ARRAY,
                GRANTS_ID_DB,
            );
        });

        it("clean database from grants from most recent exercise present in import file", async () => {
            await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            expect(mockCleanExercises).toHaveBeenCalledWith(PRODUCER_ENTITY.siret, IMPORTED_DATA_EXERCISES);
        });

        it("does not handle backup if first import (no data in DB)", async () => {
            mockIsProducerFirstImport.mockResolvedValueOnce(true);
            await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            expect(mockCleanExercises).not.toHaveBeenCalled();
            expect(mockDropBackup).not.toHaveBeenCalled();
        });

        it("does not restore backup if first import failed (no previous data in DB)", async () => {
            mockIsProducerFirstImport.mockResolvedValueOnce(true);
            mockPersistEntities.mockRejectedValueOnce(new Error("Persistence failed"));
            try {
                await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            } catch {
                expect(mockCleanExercises).not.toHaveBeenCalled();
                expect(mockRestoreBackup).not.toHaveBeenCalled();
            }
        });

        it("persists entities", async () => {
            const persistSpy = jest.spyOn(scdlService, "persistEntities").mockReturnValueOnce(Promise.resolve());
            await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            expect(persistSpy).toHaveBeenCalledWith(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
        });

        it("drops backup when persistence succeed", async () => {
            await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            expect(mockPersistEntities).toHaveBeenCalledWith(STORABLE_DATA_ARRAY, PRODUCER_ENTITY);
        });

        it("restores backup if persistence failed", async () => {
            mockPersistEntities.mockRejectedValueOnce(new Error("Persistence failed"));
            try {
                await scdlService.persist(PRODUCER_ENTITY, STORABLE_DATA_ARRAY);
            } catch {
                expect(mockRestoreBackup).toHaveBeenCalledWith(PRODUCER_ENTITY.siret);
            }
        });
    });

    describe("validateHeaders", () => {
        let consoleWarnSpy: jest.SpyInstance;
        let parsedInfos: ScdlParsedInfos;

        beforeEach(() => {
            parsedInfos = {
                allocatorsSiret: [],
                grantCoverageYears: [],
                parseableLines: 0,
                totalLines: 0,
                missingHeaders: {
                    mandatory: [],
                    optional: [],
                },
            };
            consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
        });

        afterEach(() => {
            consoleWarnSpy.mockRestore();
        });
        const filePath = "/path/to/file.xlsx";

        it("Throw error when required headers are missing", () => {
            parsedInfos.missingHeaders.mandatory = ["allocatorSiret", "exercice"];

            expect(() => scdlService.validateHeaders(parsedInfos, filePath)).toThrow(
                "Missing required headers in file /path/to/file.xlsx : allocatorSiret, exercice",
            );
        });
    });
});
