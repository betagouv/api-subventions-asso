import documentPort from "./documents.port";
import requestsService from "@services/requests.service";

jest.mock("@services/requests.service");

describe("DocumentsPort", () => {
    beforeAll(() => requestsService.get.mockImplementation(() => Promise.resolve({ data: "" })));
    const DOC_URL = "/path";

    describe("search", () => {
        it("calls requestsService get", async () => {
            const expected = [DOC_URL, {}, { responseType: "blob" }];
            await documentPort.getDauphinBlob(DOC_URL);
            expect(requestsService.get).toHaveBeenCalledWith(...expected);
        });

        it("return documents list from requestsService result", async () => {
            const expected = [];
            const RES = { data: expected };
            requestsService.get.mockResolvedValueOnce(RES);
            const actual = await documentPort.getDauphinBlob(DOC_URL);
            expect(actual).toBe(expected);
        });
    });
});
