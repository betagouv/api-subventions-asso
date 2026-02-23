import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import documentService from "$lib/resources/document/document.service";
import { DocumentMapper } from "$lib/resources/document/document.mapper";
import documentPort from "$lib/resources/document/document.port";

vi.mock("$lib/resources/document/document.mapper");
vi.mock("$lib/resources/document/document.port");

describe("document service", () => {
    describe("getSomeDocs", () => {
        const DOCS = ["doc 1", "doc 2"] as unknown as DocumentEntity[];

        it("adapts each document", () => {
            documentService.getSomeDocs(DOCS);
            expect(DocumentMapper.documentEntityToDocumentRequst).toHaveBeenCalledTimes(2);
            expect(DocumentMapper.documentEntityToDocumentRequst).toHaveBeenCalledWith(DOCS[0]);
            expect(DocumentMapper.documentEntityToDocumentRequst).toHaveBeenCalledWith(DOCS[1]);
        });

        it("calls port with adapted documents as requests", () => {
            vi.mocked(DocumentMapper.documentEntityToDocumentRequst).mockReturnValueOnce(
                "1" as unknown as DocumentEntity,
            );
            vi.mocked(DocumentMapper.documentEntityToDocumentRequst).mockReturnValueOnce(
                "2" as unknown as DocumentEntity,
            );
            documentService.getSomeDocs(DOCS);
            expect(documentPort.getSomeDocs).toHaveBeenCalledWith(["1", "2"]);
        });

        it("returns return from doc", () => {
            const expected = "something" as unknown as Promise<Blob>;
            vi.mocked(documentPort.getSomeDocs).mockReturnValue(expected);
            const actual = documentService.getSomeDocs(DOCS);
            expect(actual).toBe(expected);
        });
    });
});
