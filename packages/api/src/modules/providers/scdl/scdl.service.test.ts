import scdlService from "./scdl.service";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";

jest.mock("../../../dataProviders/db/providers/scdl/miscScdlGrant.port");
import miscScdlProducersPort from "../../../dataProviders/db/providers/scdl/miscScdlProducers.port";

jest.mock("../../../dataProviders/db/providers/scdl/miscScdlProducers.port");
import { getMD5 } from "../../../shared/helpers/StringHelper";

jest.mock("../../../shared/helpers/StringHelper");
jest.mock("./scdl.grant.parser");

import MiscScdlGrantFixture, { MISC_SCDL_GRANT_DBO_FIXTURE } from "./__fixtures__/MiscScdlGrant";
import MiscScdlProducerFixture from "./__fixtures__/MiscScdlProducer";
import { ObjectId } from "mongodb";
import { SIRET_STR } from "../../../../tests/__fixtures__/association.fixture";
import ScdlGrantParser from "./scdl.grant.parser";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";

describe("ScdlService", () => {
    const UNIQUE_ID = "UNIQUE_ID";
    const PRODUCER_SLUG = MiscScdlProducerFixture.slug;
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
            mockGetProducers = jest.spyOn(scdlService, "getProducers").mockResolvedValue([MiscScdlProducerFixture]);
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
            expect(scdlService.producerNames).toEqual([MiscScdlProducerFixture.name]);
        });
    });

    describe("getProvider()", () => {
        it("should call miscScdlProducersPort.create()", async () => {
            await scdlService.getProducer(MiscScdlProducerFixture.slug);
            expect(miscScdlProducersPort.findBySlug).toHaveBeenCalledWith(MiscScdlProducerFixture.slug);
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
            const PRODUCER = { ...MiscScdlProducerFixture };
            await scdlService.createProducer(PRODUCER);
            expect(miscScdlProducersPort.create).toHaveBeenCalledWith(PRODUCER);
        });
    });

    describe("updateProducer()", () => {
        it("should call miscScdlProducersPort.update()", async () => {
            const SET_OBJECT = {
                lastUpdate: new Date(),
            };
            await scdlService.updateProducer(MiscScdlProducerFixture.slug, SET_OBJECT);
            expect(miscScdlProducersPort.update).toHaveBeenCalledWith(MiscScdlProducerFixture.slug, SET_OBJECT);
        });
    });

    describe("_buildGrantUniqueId()", () => {
        it("should call getMD5()", async () => {
            const DATA = {};
            // @ts-expect-error: call private method
            await scdlService._buildGrantUniqueId({ __data__: DATA }, MiscScdlProducerFixture.slug);
            expect(jest.mocked(getMD5)).toHaveBeenCalledWith(`${MiscScdlProducerFixture.slug}-${JSON.stringify(DATA)}`);
        });
    });

    describe("createManyGrants()", () => {
        const PRODUCER = { _id: new ObjectId(), ...MiscScdlProducerFixture };
        let mockBuildGrantUniqueId: jest.SpyInstance;
        let mockGetProducer: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: private method
            mockBuildGrantUniqueId = jest.spyOn(scdlService, "_buildGrantUniqueId").mockReturnValue(UNIQUE_ID);
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

        it("should call getProducer", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.slug);
            expect(mockGetProducer).toHaveBeenCalledWith(MiscScdlProducerFixture.slug);
        });

        it("should call _buildGrantUniqueId()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.slug);
            expect(mockBuildGrantUniqueId).toHaveBeenCalledWith(GRANTS[0], MiscScdlProducerFixture.slug);
        });

        it("should call miscScdlGrantPort.createMany with allocator data from producer", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.slug);
            expect(miscScdlGrantPort.createMany).toHaveBeenCalledWith([
                {
                    ...GRANTS[0],
                    _id: UNIQUE_ID,
                    allocatorName: PRODUCER.name,
                    allocatorSiret: PRODUCER.siret,
                    producerSlug: PRODUCER.slug,
                },
            ]);
        });

        it("should call miscScdlGrantPort.createMany with allocator data from grant", async () => {
            const GRANTS = [
                { ...MiscScdlGrantFixture, allocatorId: SIRET_STR, allocatorName: "attribuant", __data__: {} },
            ];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.slug);
            expect(miscScdlGrantPort.createMany).toHaveBeenCalledWith([
                {
                    ...GRANTS[0],
                    _id: UNIQUE_ID,
                    producerSlug: PRODUCER.slug,
                },
            ]);
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

        it.each`
            expected | mockReturnValue
            ${false} | ${{}}
            ${true}  | ${undefined}
            ${true}  | ${null}
        `("returns $expected", async ({ expected, mockReturnValue }) => {
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
                        MiscScdlProducerFixture.slug,
                        entities.map(entity => entity.exercice),
                        entities,
                        documents,
                    ),
            ).rejects.toThrow(
                `You are trying to import less grants for exercise ${exerciseWithError} than what already exist in the database for producer ${MiscScdlProducerFixture.slug}.`,
            );
        });
    });

    describe("getGrantsOnPeriodBySlug", () => {
        const EXERCISES = [2025];

        it("calls miscScdlGrantPort.findBySlugOnPeriod()", async () => {
            await scdlService.getGrantsOnPeriodBySlug(PRODUCER_SLUG, [2025]);
            expect(miscScdlGrantPort.findBySlugOnPeriod).toHaveBeenCalledWith(PRODUCER_SLUG, EXERCISES);
        });
    });

    describe("cleanExercises", () => {
        const EXERCISES = [2022, 2023, 2024];

        beforeAll(() => {
            miscScdlGrantPort.findBySlugOnPeriod = jest.fn().mockResolvedValue(GRANTS_DBO_ARRAY);
        });

        it("creates backup for provider's data", async () => {
            await scdlService.cleanExercises(MiscScdlProducerFixture.slug, EXERCISES);
            expect(miscScdlGrantPort.createBackupCollection).toHaveBeenCalledWith(PRODUCER_SLUG);
        });

        it("delete provider's data for given exercises", async () => {
            await scdlService.cleanExercises(MiscScdlProducerFixture.slug, EXERCISES);
            expect(miscScdlGrantPort.bulkFindDeleteByExercices).toHaveBeenCalledWith(
                MiscScdlProducerFixture.slug,
                EXERCISES,
            );
        });

        it("applies backup if bulkFindDeleteByExercices throws an error", async () => {
            jest.mocked(miscScdlGrantPort).bulkFindDeleteByExercices.mockRejectedValueOnce(
                new Error("Bulk delete failed"),
            );
            await scdlService.cleanExercises(MiscScdlProducerFixture.slug, EXERCISES);
            expect(miscScdlGrantPort.applyBackupCollection).toHaveBeenCalledWith(PRODUCER_SLUG);
        });
    });

    describe("dropBackup", () => {
        it("calls dropBackupCollection", async () => {
            await scdlService.dropBackup();
            expect(miscScdlGrantPort.dropBackupCollection).toHaveBeenCalledTimes(1);
        });
    });
    describe("restoreBackup", () => {
        it("calls applyBackupCollection", async () => {
            await scdlService.restoreBackup(PRODUCER_SLUG);
            expect(miscScdlGrantPort.applyBackupCollection).toHaveBeenCalledWith(PRODUCER_SLUG);
        });
    });
});
