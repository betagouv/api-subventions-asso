import documentPort from "./documents.port";
import documentService from "./documents.service";

jest.mock("./documents.port");

describe("DocumentService", () => {
    const DOC_URL = "/path";

    describe("getDauphinBlob", () => {
        it("should call port", async () => {
            documentPort.getDauphinBlob.mockImplementationOnce(jest.fn());
            await documentService.getDauphinBlob(DOC_URL);
            expect(documentPort.getDauphinBlob).toHaveBeenCalledWith(DOC_URL);
        });

        it("should return data from port", async () => {
            const RES = "";
            documentPort.getDauphinBlob.mockResolvedValueOnce(RES);
            const expected = RES;
            const actual = await documentService.getDauphinBlob(DOC_URL);
            expect(actual).toBe(expected);
        });
    });
});
