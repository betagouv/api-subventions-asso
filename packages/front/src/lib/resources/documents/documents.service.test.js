import documentPort from "./documents.port";
vi.mock("./documents.port");
import documentService from "./documents.service";
vi.mock("$env/static/public", () => ({ DATASUB_URL: "https://api.fr" }));

describe("DocumentService", () => {
    const DOC_URL = "/path";

    describe("isInternalLink", () => {
        it("returns false for absolute url", () => {
            const expected = false;
            const actual = documentService.isInternalLink("https://google.fr");
            expect(actual).toBe(expected);
        });

        it("returns true for absolute local url", () => {
            const expected = true;
            const actual = documentService.isInternalLink("/path");
            expect(actual).toBe(expected);
        });
    });

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

    describe("addTokenToInternalLink", () => {
        const isInternalLinkSpy = vi.spyOn(documentService, "isInternalLink");
        const URL = "/?url=link";
        const DOC = { prop: "something", url: URL };
        const FAKE_TOKEN = "key";

        it("does nothing to external link", () => {
            isInternalLinkSpy.mockReturnValueOnce(false);
            const expected = DOC;
            const actual = documentService.addTokenToInternalLink(FAKE_TOKEN, DOC);
            expect(actual).toEqual(expected);
        });

        it("appends token to internal link", () => {
            isInternalLinkSpy.mockReturnValueOnce(true);
            const expected = { prop: "something", url: "https://api.fr/?url=link&token=key" };
            const actual = documentService.addTokenToInternalLink(FAKE_TOKEN, DOC);
            expect(actual).toEqual(expected);
        });
    });
});
