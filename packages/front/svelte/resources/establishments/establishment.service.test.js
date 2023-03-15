import establishmentService from "./establishment.service";
import establishmentPort from "./establishment.port";
jest.mock("./establishment.port");

describe("establishmentService", () => {
    const SIREN = "000000009";
    describe("incExtractData", () => {
        it("should call establishmentPort.extractData()", () => {
            establishmentService.incExtractData(SIREN);
            expect(establishmentPort.incExtractData).toHaveBeenCalledWith(SIREN);
        });
    });
});
