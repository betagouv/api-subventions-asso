import axios from "axios";
import establishmentPort from "./establishment.port";

describe("EstablishmentPort", () => {
    axios.get.mockImplementation(() => ({ catch: jest.fn() }));
    const SIRET = "SIRET";
    describe("incExtractData", () => {
        it("should call axios with route", () => {
            const expected = `/etablissement/${SIRET}/extract-data`;
            establishmentPort.incExtractData(SIRET);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });
    });

    describe("getBySiret", () => {
        it("should call axios with route", () => {
            const expected = `/etablissement/${SIRET}`;
            establishmentPort.getBySiret(SIRET);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });
    });

    describe("getDocuments", () => {
        it("should call axios with route", () => {
            const expected = `/etablissement/${SIRET}/documents`;
            establishmentPort.getDocuments(SIRET);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });
    });
});
