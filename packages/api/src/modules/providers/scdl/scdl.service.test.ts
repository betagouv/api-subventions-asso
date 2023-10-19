import scdlService from "./scdl.service";
import miscScdlGrantRepository from "./repositories/miscScdlGrant.repository";
jest.mock("./repositories/miscScdlGrant.repository");
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
jest.mock("./repositories/miscScdlProducer.repository");

import MiscScdlGrantFixture from "./__fixtures__/MiscScdlGrant";
import MiscScdlProducerFixture from "./__fixtures__/MiscScdlProducer";

describe("ScdlService", () => {
    describe("getProvider()", () => {
        it("should call miscScdlProducerRepository.create()", async () => {
            const PRODUCER_ID = "ID";
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
    describe("createData()", () => {
        it("should call miscScdlGrantRepository.createMany()", async () => {
            const GRANTS = [{ ...MiscScdlGrantFixture, producerId: "" }];
            await scdlService.createManyGrants(GRANTS);
            expect(miscScdlGrantRepository.createMany).toHaveBeenCalledWith(GRANTS);
        });
    });
});
