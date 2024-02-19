import scdlService from "./scdl.service";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
jest.mock("./repositories/miscScdlGrant.repository");
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
jest.mock("./repositories/miscScdlProducer.repository");
import { getMD5 } from "../../../shared/helpers/StringHelper";
jest.mock("../../../shared/helpers/StringHelper");

import MiscScdlGrantFixture from "./__fixtures__/MiscScdlGrant";
import MiscScdlProducerFixture from "./__fixtures__/MiscScdlProducer";

describe("ScdlService", () => {
    const PRODUCER_ID = "ID";
    const UNIQUE_ID = "UNIQUE_ID";
    describe("getProvider()", () => {
        it("should call miscScdlProducerRepository.create()", async () => {
            await scdlService.getProducer(PRODUCER_ID);
            expect(miscScdlProducersRepository.findByProducerId).toHaveBeenCalledWith(PRODUCER_ID);
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
            await scdlService.updateProducer(PRODUCER_ID, SET_OBJECT);
            expect(miscScdlProducersRepository.update).toHaveBeenCalledWith(PRODUCER_ID, SET_OBJECT);
        });
    });

    describe("_buildGrantUniqueId()", () => {
        it("should call getMD5()", async () => {
            const DATA = {};
            // @ts-expect-error: call private method
            await scdlService._buildGrantUniqueId({ __data__: DATA }, PRODUCER_ID);
            expect(jest.mocked(getMD5)).toHaveBeenCalledWith(`${PRODUCER_ID}-${JSON.stringify(DATA)}`);
        });
    });

    describe("createManyGrants()", () => {
        let mockBuildGrantUniqueId: jest.SpyInstance;

        beforeEach(
            () =>
                // @ts-expect-error: private method
                (mockBuildGrantUniqueId = jest.spyOn(scdlService, "_buildGrantUniqueId").mockReturnValue(UNIQUE_ID)),
        );

        it("should call _buildGrantUniqueId()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, PRODUCER_ID);
            expect(mockBuildGrantUniqueId).toHaveBeenCalledWith(GRANTS[0], PRODUCER_ID);
        });

        it("should call miscScdlGrantRepository.createMany()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, __data__: {} }];
            await scdlService.createManyGrants(GRANTS, PRODUCER_ID);
            expect(miscScdlGrantRepository.createMany).toHaveBeenCalledWith([
                { ...GRANTS[0], _id: UNIQUE_ID, producerId: PRODUCER_ID },
            ]);
        });
    });
});
