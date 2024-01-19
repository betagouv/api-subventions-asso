import rnaSirenPort from "./rna-siren.port";
import requestsService from "$lib/services/requests.service";
vi.mock("$lib/services/requests.service");

describe("RnaSirenPort", () => {
    const RNA = "W000000000";
    describe("getRnaSiren", () => {
        it("should call requestService with given identifier", async () => {
            const expected = `${rnaSirenPort.basePath}/${RNA}`;
            await rnaSirenPort.getRnaSiren(RNA);
            expect(requestsService.get).toHaveBeenCalledWith(expected);
        });
    });
});
