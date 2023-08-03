import establishmentPort from "./establishment.port";
import requestsService from "$lib/services/requests.service";
vi.mock("$lib/services/requests.service");

describe("EstablishmentPort", () => {
    requestsService.get.mockImplementation(() => ({ catch: vi.fn() }));

    vi.spyOn(requestsService, "get");
    const SIRET = "SIRET";
    describe("incExtractData", () => {
        it("should call axios with route", () => {
            const expected = `/etablissement/${SIRET}/extract-data`;
            establishmentPort.incExtractData(SIRET);
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });
    });

    describe("getBySiret", () => {
        it("should call axios with route", () => {
            const expected = `/etablissement/${SIRET}`;
            establishmentPort.getBySiret(SIRET);
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });
    });

    describe("getDocuments", () => {
        it("should call axios with route", () => {
            const expected = `/etablissement/${SIRET}/documents`;
            establishmentPort.getDocuments(SIRET);
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });
    });
});
