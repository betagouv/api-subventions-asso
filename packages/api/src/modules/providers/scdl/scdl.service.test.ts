import scdlService from "./scdl.service";
import miscScdlGrantRepository from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
jest.mock("../../../dataProviders/db/providers/scdl/miscScdlGrant.port");
import miscScdlProducersRepository from "../../../dataProviders/db/providers/scdl/miscScdlProducer.port";
jest.mock("../../../dataProviders/db/providers/scdl/miscScdlProducer.port");
import { getMD5 } from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");

import MiscScdlGrantFixture from "./__fixtures__/MiscScdlGrant";
import MiscScdlProducerFixture from "./__fixtures__/MiscScdlProducer";
import { ObjectId } from "mongodb";
import { SIRET_STR } from "../../../../tests/__fixtures__/association.fixture";

describe("ScdlService", () => {
    const UNIQUE_ID = "UNIQUE_ID";

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
        it("should call miscScdlProducerRepository.create()", async () => {
            await scdlService.getProducer(MiscScdlProducerFixture.slug);
            expect(miscScdlProducersRepository.findBySlug).toHaveBeenCalledWith(MiscScdlProducerFixture.slug);
        });
    });

    describe("getProducers", () => {
        it("should call findAll", async () => {
            await scdlService.getProducers();
            expect(miscScdlProducersRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("createProducer()", () => {
        it("should call miscScdlProducerRepository.create()", async () => {
            const PRODUCER = { ...MiscScdlProducerFixture };
            await scdlService.createProducer(PRODUCER);
            expect(miscScdlProducersRepository.create).toHaveBeenCalledWith(PRODUCER);
        });
    });

    describe("updateProducer()", () => {
        it("should call miscScdlProducerRepository.update()", async () => {
            const SET_OBJECT = {
                lastUpdate: new Date(),
            };
            await scdlService.updateProducer(MiscScdlProducerFixture.slug, SET_OBJECT);
            expect(miscScdlProducersRepository.update).toHaveBeenCalledWith(MiscScdlProducerFixture.slug, SET_OBJECT);
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

        it("should call miscScdlGrantRepository.createMany with allocator data from producer", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.slug);
            expect(miscScdlGrantRepository.createMany).toHaveBeenCalledWith([
                {
                    ...GRANTS[0],
                    _id: UNIQUE_ID,
                    allocatorName: PRODUCER.name,
                    allocatorSiret: PRODUCER.siret,
                    producerSlug: PRODUCER.slug,
                },
            ]);
        });

        it("should call miscScdlGrantRepository.createMany with allocator data from grant", async () => {
            const GRANTS = [
                { ...MiscScdlGrantFixture, allocatorId: SIRET_STR, allocatorName: "attribuant", __data__: {} },
            ];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.slug);
            expect(miscScdlGrantRepository.createMany).toHaveBeenCalledWith([
                {
                    ...GRANTS[0],
                    _id: UNIQUE_ID,
                    producerSlug: PRODUCER.slug,
                },
            ]);
        });
    });
});
