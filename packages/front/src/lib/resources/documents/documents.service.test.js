import documentPort from "./documents.port";
vi.mock("./documents.port");
import documentService from "./documents.service";
vi.mock("$env/static/public", () => ({ DATASUB_URL: "https://api.fr" }));

describe("DocumentService", () => {
    const DOC_URL = "/path";

    describe("getBlob", () => {
        it("should call port", async () => {
            vi.mocked(documentPort.getBlob).mockImplementationOnce(vi.fn());
            await documentService.getBlob(DOC_URL);
            expect(documentPort.getBlob).toHaveBeenCalledWith(DOC_URL);
        });

        it("should return data from port", async () => {
            const RES = "";
            vi.mocked(documentPort.getBlob).mockResolvedValueOnce(RES);
            const expected = RES;
            const actual = await documentService.getBlob(DOC_URL);
            expect(actual).toBe(expected);
        });
    });
});
