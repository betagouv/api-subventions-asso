import type { DocumentEntity } from "$lib/entities/DocumentEntity";
import { DocumentAdapter } from "$lib/resources/document/document.adapter";

describe("DocumentAdapter", () => {
    describe("documentEntityToDocumentRequst", () => {
        it("adapts properly", () => {
            const ENTITY: DocumentEntity = {
                __meta__: { siret: "123456789" },
                date: new Date("2023-02-02"),
                label: "label",
                nom: "nom",
                provider: "provider",
                type: "type",
                url: "http://url",
            };
            const actual = DocumentAdapter.documentEntityToDocumentRequst(ENTITY);
            expect(actual).toMatchInlineSnapshot(`
              {
                "nom": "nom",
                "type": "type",
                "url": "http://url",
              }
            `);
        });
    });
});
