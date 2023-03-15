import axios from "axios";
import establishmentPort from "./establishment.port";

describe("EstablishmentPort", () => {
    axios.get.mockImplementation(() => ({ catch: jest.fn() }));
    const SIRET = "SIRET";
    describe("incExtractData", () => {
        it("should call axios with association in path", () => {
            const expected = `/etablissement/${SIRET}/extract-data`;
            establishmentPort.incExtractData(SIRET);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });
    });
});
