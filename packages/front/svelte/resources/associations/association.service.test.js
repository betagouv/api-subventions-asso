import associationService from "./association.service";
import associationPort from "./association.port";
jest.mock("./association.port");

describe("AssociationService", () => {
    const SIREN = "000000009";
    describe("incExtractData", () => {
        it("should call associationPort.extractData()", () => {
            associationService.incExtractData(SIREN);
            expect(associationPort.incExtractData).toHaveBeenCalledWith(SIREN);
        });
    });
});
