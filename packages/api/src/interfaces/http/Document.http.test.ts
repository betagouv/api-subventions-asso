import documentsService from "../../modules/documents/documents.service";
import SpyInstance = jest.SpyInstance;
import { DocumentHttp } from "./Document.http";
import { IncomingMessage } from "http";
import { ReadStream } from "node:fs";
import { DocumentRequestDto } from "dto";
import { IdentifiedRequest } from "../../@types";

jest.mock("../../modules/documents/documents.service");

describe("DocumentController", () => {
    const CONTENT_TYPE = "mimeType";
    const STREAM = { headers: { "content-type": CONTENT_TYPE } } as IncomingMessage;
    const DECODED_PATH = "/a/b";
    const ENCODED_PATH = "%2Fa%2Fb";
    const PROVIDER_ID = "providerId";
    let documentController: DocumentHttp;
    let documentServiceMock: SpyInstance, setHeaderMock: SpyInstance;

    beforeAll(() => {
        documentServiceMock = jest.spyOn(documentsService, "getDocumentStream").mockResolvedValue(STREAM);
        documentController = new DocumentHttp();
        setHeaderMock = jest.spyOn(documentController, "setHeader").mockImplementation(jest.fn());
    });

    describe("getDocumentStream", () => {
        it("calls document service", async () => {
            await documentController.getDocumentStream(PROVIDER_ID, ENCODED_PATH);
            expect(documentServiceMock).toHaveBeenCalledWith(PROVIDER_ID, DECODED_PATH);
        });

        it("sets headers", async () => {
            await documentController.getDocumentStream(PROVIDER_ID, ENCODED_PATH);
            expect(setHeaderMock).toHaveBeenCalledTimes(2);
            setHeaderMock.mockReset();
        });

        it("sets default header if none from stream", async () => {
            documentServiceMock.mockResolvedValueOnce({ headers: {} });
            await documentController.getDocumentStream(PROVIDER_ID, ENCODED_PATH);
            expect(setHeaderMock).toHaveBeenCalledTimes(2);
        });

        it("returns stream from document service", async () => {
            const expected = STREAM;
            const actual = await documentController.getDocumentStream(PROVIDER_ID, ENCODED_PATH);
            expect(actual).toEqual(expected);
        });
    });

    describe("downloadRequiredDocuments", () => {
        const stream = {};
        const REQUIRED_DOCS: DocumentRequestDto[] = [
            { type: "relevé", url: "https://some.thing", nom: "relevéQqchose" },
        ];
        const USER_ID = "ID";
        // @ts-expect-error mock
        const REQUEST: IdentifiedRequest = { user: { _id: { toString: jest.fn(() => USER_ID) } } };

        beforeAll(() => {
            jest.mocked(documentsService.getRequestedDocumentsFiles).mockResolvedValue(stream as ReadStream);
            documentController = new DocumentHttp();
            setHeaderMock = jest.spyOn(documentController, "setHeader").mockImplementation(jest.fn());
        });

        it("should set headers", async () => {
            await documentController.downloadRequiredDocuments(REQUIRED_DOCS, REQUEST);
            expect(setHeaderMock).toHaveBeenCalledWith("Content-Type", "application/zip");
            expect(setHeaderMock).toHaveBeenCalledWith("Content-Disposition", "inline");
        });

        it("should call service with required docs and user id as temp folder ", async () => {
            await documentController.downloadRequiredDocuments(REQUIRED_DOCS, REQUEST);
            expect(documentsService.getRequestedDocumentsFiles).toHaveBeenCalledWith(REQUIRED_DOCS, USER_ID);
        });

        it("should return stream", async () => {
            const expected = stream;
            const actual = await documentController.downloadRequiredDocuments(REQUIRED_DOCS, REQUEST);
            expect(actual).toEqual(expected);
        });
    });

    describe("downloadDocuments", () => {
        let getDocumentsFilesSpy: jest.SpyInstance;
        const stream = {};

        beforeAll(() => {
            getDocumentsFilesSpy = jest.spyOn(documentsService, "getDocumentsFilesByIdentifier");
            getDocumentsFilesSpy.mockResolvedValue(stream);
            documentController = new DocumentHttp();
            setHeaderMock = jest.spyOn(documentController, "setHeader").mockImplementation(jest.fn());
        });

        it("should set headers", async () => {
            await documentController.downloadDocumentsByIdentifier("test");
            expect(setHeaderMock).toHaveBeenCalledWith("Content-Type", "application/zip");
            expect(setHeaderMock).toHaveBeenCalledWith("Content-Disposition", "inline");
        });

        it("should return stream", async () => {
            const expected = stream;
            const actual = await documentController.downloadDocumentsByIdentifier("test");
            expect(actual).toEqual(expected);
        });
    });
});
