import establishmentPort from "./establishment.port";
import establishmentService from "./establishment.service";
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
