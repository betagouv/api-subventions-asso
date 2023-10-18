import scdlService from "./scdl.service";
import miscScdlDataRepository from "./repositories/miscScdlData.repository";
jest.mock("./miscScdlData.repository");
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";
jest.mock("./miscScdlProducer.repository");

import MiscScdlDataFixture from "./__fixtures__/MiscScdlData";
import MiscScdlProducerFixture from "./__fixtures__/MiscScdlProducer";

describe("ScdlService", () => {
    describe("createProducer", () => {
        it("should call miscScdlProducerRepository.create()", async () => {
            const PRODUCER = { ...MiscScdlProducerFixture };
            await scdlService.createProducer(PRODUCER);
            expect(miscScdlProducersRepository.create).toHaveBeenCalledWith(PRODUCER);
        });
    });
    describe("createData", () => {
        it("should call miscScdlDataRepository.create()", async () => {
            const DATA = { ...MiscScdlDataFixture };
            await scdlService.createData(DATA);
            expect(miscScdlDataRepository.create).toHaveBeenCalledWith(DATA);
        });
    });
});
