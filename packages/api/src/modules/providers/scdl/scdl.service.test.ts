import scdlService from "./scdl.service";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";

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

jest.mock("../../../dataProviders/db/applicationFlat/applicationFlat.port");
jest.mock("../apiAsso/apiAsso.service");
describe("ScdlService", () => {
    const UNIQUE_ID = "UNIQUE_ID";
    const PRODUCER = { ...PRODUCER_FIXTURE };
    const PRODUCER_SLUG = PRODUCER.slug;
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

    describe("init", () => {
        let mockGetProducers;

        beforeAll(() => {
            mockGetProducers = jest.spyOn(scdlService, "getProducers").mockResolvedValue([PRODUCER]);
        });

        afterAll(() => {
            mockGetProducers.mockRestore();
        });

        it("should call getProducers", async () => {
            await scdlService.init();
            expect(mockGetProducers).toHaveBeenCalledTimes(1);
        });

        it("should set producerNames", async () => {
            await scdlService.init();
            expect(scdlService.producerNames).toEqual([PRODUCER.name]);
        });
    });

    describe("getSlugFromName", () => {
        it.each`
            name                          | expected                      | comment
            ${"COMMUNUE-DE-SAINT-BRIEUC"} | ${"communue-de-saint-brieuc"} | ${"lowercases all letters"}
            ${"Commune de Saint-Brieuc"}  | ${"commune-de-saint-brieuc"}  | ${"replaces white space with hiphens"}
            ${"Commune_de_Saint_Brieuc"}  | ${"commune-de-saint-brieuc"}  | ${"replaces white space with hiphens"}
            ${"Departement de L'Oise"}    | ${"departement-de-l-oise"}    | ${"replaces single quote with hiphens"}
            ${"Départémént de L'Oïsè"}    | ${"departement-de-l-oise"}    | ${"replaces accents"}
        `("$comment", ({ name, expected, _comment }) => {
            const actual = scdlService.getSlugFromName(name);
            expect(actual).toEqual(expected);
        });
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
            await scdlService._buildGrantUniqueId({ __data__: DATA }, PRODUCER.slug);
            expect(jest.mocked(getMD5)).toHaveBeenCalledWith(`${PRODUCER.slug}-${JSON.stringify(DATA)}`);
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
            expect(mockBuildGrantUniqueId).toHaveBeenCalledWith(GRANTS[0], PRODUCER.slug);
        });

        it("returns data with allocator data from producer", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            const expected = [
                {
                    ...GRANTS[0],
                    _id: UNIQUE_ID,
                    allocatorName: PRODUCER.name,
                    allocatorSiret: PRODUCER.siret,
                    producerSlug: PRODUCER.slug,
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
        it("calls miscScdlGrantPort.hasGrantFromSlug()", async () => {
            // @ts-expect-error: mock return value
            jest.mocked(miscScdlGrantPort.findOneBySlug).mockResolvedValue({} as MiscScdlGrantEntity);
            await scdlService.isProducerFirstImport(PRODUCER_SLUG);
            expect(miscScdlGrantPort.findOneBySlug).toHaveBeenCalledWith(PRODUCER_SLUG);
        });

        it("returns false if data already in db for the given producer slug", async () => {
            jest.mocked(miscScdlGrantPort.findOneBySlug).mockResolvedValue({} as ScdlGrantDbo);
            const actual = await scdlService.isProducerFirstImport(PRODUCER_SLUG);
            expect(actual).toEqual(false);
        });

        it.each`
            expected | mockReturnValue
            ${true}  | ${undefined}
            ${true}  | ${null}
        `("returns $expected with $mockReturnValue", async ({ expected, mockReturnValue }) => {
            jest.mocked(miscScdlGrantPort.findOneBySlug).mockResolvedValue(mockReturnValue);
            const actual = await scdlService.isProducerFirstImport(PRODUCER_SLUG);
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
                        PRODUCER.slug,
                        entities.map(entity => entity.exercice),
                        entities,
                        documents,
                    ),
            ).rejects.toThrow(
                `You are trying to import less grants for exercise ${exerciseWithError} than what already exist in the database for producer ${PRODUCER.slug}.`,
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
            await scdlService.cleanExercises(PRODUCER.slug, EXERCISES);
            expect(miscScdlGrantPort.createBackupCollection).toHaveBeenCalledWith(PRODUCER_SLUG);
        });

        it("delete provider's data for given exercises", async () => {
            await scdlService.cleanExercises(PRODUCER.slug, EXERCISES);
            expect(miscScdlGrantPort.bulkFindDeleteByExercices).toHaveBeenCalledWith(PRODUCER.slug, EXERCISES);
        });

        it("applies backup for scdl if bulkFindDeleteByExercices throws an error", async () => {
            jest.mocked(miscScdlGrantPort).bulkFindDeleteByExercices.mockRejectedValueOnce(
                new Error("Bulk delete failed"),
            );
            await scdlService.cleanExercises(PRODUCER.slug, EXERCISES);
            expect(miscScdlGrantPort.applyBackupCollection).toHaveBeenCalledWith(PRODUCER_SLUG);
        });

        it("applies backup for applicationFlat if bulkFindDeleteByExercices throws an error", async () => {
            jest.mocked(miscScdlGrantPort).bulkFindDeleteByExercices.mockRejectedValueOnce(
                new Error("Bulk delete failed"),
            );
            await scdlService.cleanExercises(PRODUCER.slug, EXERCISES);
            expect(applicationFlatPort.applyBackupCollection).toHaveBeenCalledWith(`scdl-${PRODUCER_SLUG}`);
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
            await scdlService.restoreBackup(PRODUCER_SLUG);
            expect(miscScdlGrantPort.applyBackupCollection).toHaveBeenCalledWith(PRODUCER_SLUG);
        });

        it("calls applyBackupCollection for applicationFlat", async () => {
            await scdlService.restoreBackup(PRODUCER_SLUG);
            expect(applicationFlatPort.applyBackupCollection).toHaveBeenCalledWith(`scdl-${PRODUCER_SLUG}`);
        });
    });
});
