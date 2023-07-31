import documentPort from "./documents.port";
vi.mock("./documents.port");
import documentService from "./documents.service";

describe("DocumentService", () => {
    const DOC_URL = "/path";

    describe("getDauphinBlob", () => {
        it("should call port", async () => {
            vi.mocked(documentPort.getDauphinBlob).mockImplementationOnce(vi.fn());
            await documentService.getDauphinBlob(DOC_URL);
            expect(documentPort.getDauphinBlob).toHaveBeenCalledWith(DOC_URL);
        });

        it("should return data from port", async () => {
            const RES = "";
            vi.mocked(documentPort.getDauphinBlob).mockResolvedValueOnce(RES);
            const expected = RES;
            const actual = await documentService.getDauphinBlob(DOC_URL);
            expect(actual).toBe(expected);
        });
    });
});
