import scdlService from "./scdl.service";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
jest.mock("./repositories/miscScdlGrant.repository");
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
jest.mock("./repositories/miscScdlProducer.repository");
import { getMD5 } from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");

import MiscScdlGrantFixture from "./__fixtures__/MiscScdlGrant";
import MiscScdlProducerFixture from "./__fixtures__/MiscScdlProducer";
import { ObjectId } from "mongodb";

describe("ScdlService", () => {
    const UNIQUE_ID = "UNIQUE_ID";
    describe("getProvider()", () => {
        it("should call miscScdlProducerRepository.create()", async () => {
            await scdlService.getProducer(MiscScdlProducerFixture.producerId);
            expect(miscScdlProducersRepository.findByProducerId).toHaveBeenCalledWith(
                MiscScdlProducerFixture.producerId,
            );
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
            await scdlService.updateProducer(MiscScdlProducerFixture.producerId, SET_OBJECT);
            expect(miscScdlProducersRepository.update).toHaveBeenCalledWith(
                MiscScdlProducerFixture.producerId,
                SET_OBJECT,
            );
        });
    });

    describe("_buildGrantUniqueId()", () => {
        it("should call getMD5()", async () => {
            const DATA = {};
            // @ts-expect-error: call private method
            await scdlService._buildGrantUniqueId({ __data__: DATA }, MiscScdlProducerFixture.producerId);
            expect(jest.mocked(getMD5)).toHaveBeenCalledWith(
                `${MiscScdlProducerFixture.producerId}-${JSON.stringify(DATA)}`,
            );
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
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.producerId);
            expect(mockGetProducer).toHaveBeenCalledWith(MiscScdlProducerFixture.producerId);
        });

        it("should call _buildGrantUniqueId()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.producerId);
            expect(mockBuildGrantUniqueId).toHaveBeenCalledWith(GRANTS[0], MiscScdlProducerFixture.producerId);
        });

        it("should call miscScdlGrantRepository.createMany()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, MiscScdlProducerFixture.producerId);
            expect(miscScdlGrantRepository.createMany).toHaveBeenCalledWith([
                { ...GRANTS[0], _id: UNIQUE_ID, allocatorName: PRODUCER.producerName, producerId: PRODUCER.producerId },
            ]);
        });
    });
});
