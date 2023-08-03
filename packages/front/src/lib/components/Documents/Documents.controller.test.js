import { DocumentsController } from "$lib/components/Documents/Documents.controller";
import documentService from "$lib/resources/documents/documents.service";
vi.mock("$lib/resources/documents/documents.service");

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
        const EVENT = { preventDefault: vi.fn() };
        const DOC = { url: "/path", nom: "name" };
        const ELEMENT = { href: "", setAttribute: vi.fn(), click: vi.fn() };
        beforeAll(() => {
            documentService.getDauphinBlob.mockResolvedValue(BLOB);
            oldURL = window.URL;
            oldCreateElement = document.createElement;
            oldAppendChild = document.body.appendChild;
            delete window.URL;
            delete document.createElement;
            delete document.body;
            window.URL = {
                createObjectURL: vi.fn((..._args) => BLOB_URL),
                revokeObjectURL: vi.fn(),
            };

            document.body.appendChild = vi.fn();
            document.createElement = vi.fn((..._args) => ELEMENT);
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
                expect(ELEMENT.setAttribute).toHaveBeenCalledWith("download", DOC.nom) &&
                expect(ELEMENT.setAttribute).toHaveBeenCalledWith("target", "_blank");
        });

        it("clicks link", async () => {
            await documentController.onClick(EVENT, DOC);
            expect(ELEMENT.click).toHaveBeenCalled();
        });
    });
});
