import { DocumentsController } from "@components/Documents/Documents.controller";
import documentService from "@resources/documents/documents.service";
jest.mock("@resources/documents/documents.service");

describe("Documents.controller", () => {
    let documentController;
    beforeAll(() => (documentController = new DocumentsController("association")));

    describe("isInternalLink", () => {
        it("returns false for absolute url", () => {
            const expected = false;
            const actual = documentController.isInternalLink("https://google.fr");
            expect(actual).toBe(expected);
        });

        it("returns true for absolute local url", () => {
            const expected = true;
            const actual = documentController.isInternalLink("/path");
            expect(actual).toBe(expected);
        });
    });

    describe("onClick", () => {
        let oldURL, oldCreateElement, oldAppendChild;
        const BLOB = "blob";
        const BLOB_URL = "/blob/url";
        const EVENT = { preventDefault: jest.fn() };
        const DOC = { url: "/path", nom: "name" };
        const ELEMENT = { href: "", setAttribute: jest.fn(), click: jest.fn() };
        beforeAll(() => {
            documentService.getDauphinBlob.mockResolvedValue(BLOB);
            oldURL = window.URL;
            oldCreateElement = document.createElement;
            oldAppendChild = document.body.appendChild;
            delete window.URL;
            delete document.createElement;
            delete document.body;
            window.URL = {
                createObjectURL: jest.fn((...args) => BLOB_URL),
                revokeObjectURL: jest.fn(),
            };

            document.body.appendChild = jest.fn();
            document.createElement = jest.fn((...args) => ELEMENT);
        });

        afterAll(() => {
            delete window.URL;
            window.URL = oldURL;
            document.body.appendChild = oldAppendChild;
            document.createElement = oldCreateElement;
        });

        it("returns without calling service if external link", async () => {
            await documentController.onClick(EVENT, { url: "https://google.fr" });
            expect(EVENT.preventDefault).not.toHaveBeenCalled() &&
                expect(documentService.getDauphinBlob).not.toHaveBeenCalled();
        });

        it("prevents default event management", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(EVENT.preventDefault).toHaveBeenCalled();
        });

        it("gets blob from documentService", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(documentService.getDauphinBlob).toHaveBeenCalled();
        });

        it("creates object url with blob", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(window.URL.createObjectURL).toHaveBeenCalledWith(BLOB);
        });

        it("create link element", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(document.createElement).toHaveBeenCalledWith("a");
        });

        it("link attributes properly tested", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(ELEMENT.href).toBe(BLOB_URL) &&
                ELEMENT.setAttribute.toHaveBeenCalledWith("download", DOC.name) &&
                ELEMENT.setAttribute.toHaveBeenCalledWith("target", "_blank");
        });

        it("clicks link", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(ELEMENT.click).toHaveBeenCalled();
        });
    });
});
