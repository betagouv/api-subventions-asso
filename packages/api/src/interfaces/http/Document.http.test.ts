import documentsService from "../../modules/documents/documents.service";
import SpyInstance = jest.SpyInstance;
import { DocumentHttp } from "./Document.http";

describe("DocumentController", () => {
    const CONTENT_TYPE = "mimeType";
    const STREAM = { headers: { "content-type": CONTENT_TYPE } };
    const DECODED_PATH = "/a/b";
    const ENCODED_PATH = "%2Fa%2Fb";
    let documentController: DocumentHttp;
    let documentServiceMock: SpyInstance, setHeaderMock: SpyInstance;

    beforeAll(() => {
        // @ts-expect-error mock
        documentServiceMock = jest.spyOn(documentsService, "getDauphinDocumentStream").mockResolvedValue(STREAM);
        documentController = new DocumentHttp();
        setHeaderMock = jest.spyOn(documentController, "setHeader").mockImplementation(jest.fn());
    });

    describe("getDauphinDocument", () => {
        it("calls document service", async () => {
            await documentController.getDauphinDocumentStream(ENCODED_PATH);
            expect(documentServiceMock).toHaveBeenCalledWith(DECODED_PATH);
        });

        it("sets headers", async () => {
            await documentController.getDauphinDocumentStream(ENCODED_PATH);
            expect(setHeaderMock).toHaveBeenCalledTimes(2);
            setHeaderMock.mockReset();
        });

        it("sets default header if none from stream", async () => {
            documentServiceMock.mockResolvedValueOnce({ headers: {} });
            await documentController.getDauphinDocumentStream(ENCODED_PATH);
            expect(setHeaderMock).toHaveBeenCalledTimes(2);
        });

        it("returns stream from document service", async () => {
            const expected = STREAM;
            const actual = await documentController.getDauphinDocumentStream(ENCODED_PATH);
            expect(actual).toEqual(expected);
        });
    });
});
