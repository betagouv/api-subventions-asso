import documentPort from "./documents.port";
import requestsService from "$lib/services/requests.service";

vi.mock("$lib/services/requests.service");

describe("DocumentsPort", () => {
    beforeAll(() => vi.mocked(requestsService.get).mockImplementation(() => Promise.resolve({ data: "" })));
    const DOC_URL = "/path";

    describe("getBlob", () => {
        it("calls requestsService get", async () => {
            const expected = [DOC_URL, {}, { responseType: "blob" }];
            await documentPort.getBlob(DOC_URL);
            expect(requestsService.get).toHaveBeenCalledWith(...expected);
        });

        it("return documents list from requestsService result", async () => {
            const expected = [];
            const RES = { data: expected };
            vi.mocked(requestsService.get).mockResolvedValueOnce(RES);
            const actual = await documentPort.getBlob(DOC_URL);
            expect(actual).toBe(expected);
        });
    });
});
