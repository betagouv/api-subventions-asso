import axios from "axios";
import associationPort from "./association.port";

describe("AssociationPort", () => {
    axios.get.mockImplementation(() => ({ catch: jest.fn() }));
    const SIREN = "SIREN";
    describe("incExtractData", () => {
        it("should call axios with association in path", () => {
            const expected = `/association/${SIREN}/extract-data`;
            associationPort.incExtractData(SIREN);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });
    });
});
