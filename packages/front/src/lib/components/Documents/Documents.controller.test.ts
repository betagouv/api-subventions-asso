import { DocumentsController } from "$lib/components/Documents/Documents.controller";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import * as associationStore from "$lib/store/association.store";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import Store from "$lib/core/Store";
import documentService from "$lib/resources/document/document.service";
import documentHelper from "$lib/helpers/document.helper";
import type { DocumentEntity } from "$lib/entities/DocumentEntity";

vi.mock("$lib/resources/documents/documents.service");
vi.mock("$lib/helpers/document.helper");
vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/resources/establishments/establishment.service");
vi.mock("$lib/store/association.store", () => ({
    currentAssociation: undefined,
}));
vi.mock("$lib/helpers/visibilityHelper");
vi.mock("$lib/resources/document/document.service");

describe("Documents.controller", () => {
    let ctrl;
    const ASSOCIATION = { rna: "RNA", siren: "SIREN", nic_siege: "NIC" };
    const ESTABLISHMENT = { siret: "SIRET" };

    function resetController() {
        const ctrlNotSpied = new DocumentsController("association", ASSOCIATION, []);
        ctrl = Object.create(Object.getPrototypeOf(ctrlNotSpied), Object.getOwnPropertyDescriptors(ctrlNotSpied));

        ctrl._getAssociationDocuments = vi.spyOn(ctrlNotSpied, "_getAssociationDocuments");
        ctrl._removeDuplicates = vi.spyOn(ctrlNotSpied, "_removeDuplicates");
        ctrl._getEstablishmentDocuments = vi.spyOn(ctrlNotSpied, "_getEstablishmentDocuments");
        ctrl._organizeDocuments = vi.spyOn(ctrlNotSpied, "_organizeDocuments");
        ctrl.onMount = vi.spyOn(ctrlNotSpied, "onMount");
        ctrl.download = vi.spyOn(ctrlNotSpied, "download");
        // @ts-expect-error spy private
        ctrl.downloadAll = vi.spyOn(ctrlNotSpied, "downloadAll");
        // @ts-expect-error spy private
        ctrl.downloadSelected = vi.spyOn(ctrlNotSpied, "downloadSelected");
        // @ts-expect-error spy private
        ctrl._filterAssoDocs = vi.spyOn(ctrlNotSpied, "_filterAssoDocs");

        vi.mocked(associationService).getDocuments.mockResolvedValue([]);
        vi.mocked(establishmentService).getDocuments.mockResolvedValue([]);
        // @ts-expect-error: partial association
        associationStore["currentAssociation"] = new Store(ASSOCIATION);
    }

    beforeAll(() => {
        resetController();
    });

    describe("_getAssociationDocument", () => {
        it("calls associationService.getDocuments with RNA", async () => {
            await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.rna);
        });

        it("filters association docs", async () => {
            const DOCS = "docs" as unknown as DocumentEntity[];
            vi.mocked(associationService.getDocuments).mockResolvedValueOnce(DOCS);
            vi.mocked(ctrl._filterAssoDocs).mockResolvedValueOnce([]);
            await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(ctrl._filterAssoDocs).toHaveBeenCalledWith(DOCS, "SIRENNIC");
        });

        it("returns filtered docs", async () => {
            const DOCS = "docs" as unknown as DocumentEntity[];
            const expected = DOCS;
            vi.mocked(ctrl._filterAssoDocs).mockResolvedValueOnce(DOCS);
            const actual = await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(actual).toBe(expected);
        });
    });

    describe("_filterAssoDocs", () => {
        const SIRET = ESTABLISHMENT.siret;

        it("keep docs with no siret", async () => {
            const DOCS = [{ __meta__: { siret: undefined } }];
            const expected = 1;
            const actual = ctrl._filterAssoDocs(DOCS, SIRET).length;
            expect(actual).toBe(expected);
        });

        it("keeps ribs with given siret", async () => {
            const DOCS = [{ type: "RIB", __meta__: { siret: SIRET } }];
            const expected = 1;
            const actual = ctrl._filterAssoDocs(DOCS, SIRET).length;
            expect(actual).toBe(expected);
        });

        it("skips ribs with other siret", async () => {
            const DOCS = [{ type: "RIB", __meta__: { siret: "OTHER_SIRET" } }];
            const expected = 0;
            const actual = ctrl._filterAssoDocs(DOCS, SIRET).length;
            expect(actual).toBe(expected);
        });

        it("keeps docs other than rib with other siret", async () => {
            const DOCS = [{ type: "anything", __meta__: { siret: "SIRENNIC" } }];
            const expected = 1;
            const actual = ctrl._filterAssoDocs(DOCS, SIRET).length;
            expect(actual).toBe(expected);
        });
    });

    describe("_removeDuplicates", () => {
        it("returns array with no duplicate document url", () => {
            const DOCS_WITH_DUPLICATES = [{ url: "url1" }, { url: "url2" }, { url: "url1" }];
            const actual = ctrl._removeDuplicates(DOCS_WITH_DUPLICATES);
            const expected = [{ url: "url1" }, { url: "url2" }];
            expect(actual).toEqual(expected);
        });
    });

    describe("_getEstablishmentDocuments", () => {
        beforeAll(() => {
            ctrl._removeDuplicates.mockImplementation(docs => docs);
        });

        afterAll(() => {
            ctrl._removeDuplicates.mockRestore();
        });

        it("calls establishmentService.getDocuments with SIRET", async () => {
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(establishmentService.getDocuments).toHaveBeenCalledWith(ESTABLISHMENT.siret);
        });

        it("calls associationService.getDocuments with RNA", async () => {
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.rna);
        });

        it("filters association docs", async () => {
            const DOCS = "docs" as unknown as DocumentEntity[];
            vi.mocked(associationService.getDocuments).mockResolvedValueOnce(DOCS);
            vi.mocked(ctrl._filterAssoDocs).mockResolvedValueOnce([]);
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(ctrl._filterAssoDocs).toHaveBeenCalledWith(DOCS, "SIRET");
        });

        it("calls _removeDuplicates with filtered results from services", async () => {
            const DOC_ASSO = { __meta__: { siret: "SIRET" }, name: "from asso" };
            const DOC_ETAB = { __meta__: { siret: "SIRET" }, name: "from etab" } as unknown as DocumentEntity;

            vi.mocked(establishmentService).getDocuments.mockResolvedValueOnce([DOC_ETAB]);
            vi.mocked(ctrl._filterAssoDocs).mockResolvedValueOnce([DOC_ASSO]);

            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(ctrl._removeDuplicates).toHaveBeenCalledWith([DOC_ETAB, DOC_ASSO]);
        });

        it("return result from _removeDuplicates", async () => {
            const expected = "RES";
            ctrl._removeDuplicates.mockReturnValueOnce(expected);
            const actual = await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(actual).toBe(expected);
        });
    });

    describe("_organizeDocuments", () => {
        const DOCS = [
            { provider: "Dauphin", nom: "Document dauphin" },
            { provider: "Le Compte Asso", nom: "Document Le Compte Asso" },
            { provider: "RNA", nom: "Document RNA" },
            { provider: "Avis de Situation Insee", nom: "Document Avis de Situation Insee" },
        ];

        it("separates asso docs and etab docs", () => {
            const actual = ctrl._organizeDocuments(DOCS);
            expect(actual).toMatchObject({
                assoDocs: [
                    {
                        nom: "Document RNA",
                        provider: "RNA",
                    },
                    {
                        nom: "Document Avis de Situation Insee",
                        provider: "Avis de Situation Insee",
                    },
                ],
                estabDocs: [
                    {
                        nom: "Document dauphin",
                        provider: "Dauphin",
                    },
                    {
                        nom: "Document Le Compte Asso",
                        provider: "Le Compte Asso",
                    },
                ],
            });
        });

        it("returns `some` with true if some docs", () => {
            const actual = ctrl._organizeDocuments(DOCS).some;
            expect(actual).toBe(true);
        });

        it("returns `some` with false if no docs", () => {
            const actual = ctrl._organizeDocuments([]).some;
            expect(actual).toBe(false);
        });
    });

    describe("onMount", () => {
        let getterSpy;
        beforeAll(() => {
            getterSpy = vi.spyOn(ctrl, "_getterByType", "get");
        });
        it("awaits that component is visible", async () => {
            await ctrl.onMount();
            expect(waitElementIsVisible).toHaveBeenCalledWith(ctrl.element);
        });

        it("calls _getterByType", async () => {
            await ctrl.onMount();
            expect(getterSpy).toHaveBeenCalled();
        });

        it("calls result from _getterByType with resource", async () => {
            const mockedGetter = vi.fn((..._args) => Promise.resolve([]));
            getterSpy.mockReturnValueOnce(mockedGetter);
            await ctrl.onMount();
            expect(mockedGetter).toHaveBeenCalledWith(ctrl.resource);
        });

        describe("documentPromise", () => {
            const DOCS = ["DOC1", "DOC2"];
            let documentsPromise;

            beforeEach(async () => {
                const mockedGetter = vi.fn((..._args) => Promise.resolve(DOCS));
                getterSpy.mockReturnValueOnce(mockedGetter);
                await ctrl.onMount();
                documentsPromise = ctrl.documentsPromise.value;
            });

            it("sets allFlatDocs", async () => {
                await documentsPromise;
                const expected = DOCS;
                const actual = ctrl.allFlatDocs;
                expect(actual).toEqual(expected);
            });

            it("calls sets documentsPromise _organizeDocuments found docs", async () => {
                await documentsPromise;
                expect(ctrl._organizeDocuments).toHaveBeenCalledWith(DOCS);
            });
        });
    });

    describe("download", () => {
        beforeAll(() => {
            vi.mocked(ctrl.downloadAll).mockResolvedValue("");
            vi.mocked(ctrl.downloadSelected).mockResolvedValue("");
            vi.mocked(documentHelper.download).mockResolvedValue();
        });

        afterAll(() => {
            vi.mocked(ctrl.downloadAll).mockRestore();
            vi.mocked(ctrl.downloadSelected).mockRestore();
            vi.mocked(documentHelper.download).mockRestore();
        });

        describe.each`
            case               | downloadMethodName    | flatSelectedDocs
            ${"download all"}  | ${"downloadAll"}      | ${[]}
            ${"download some"} | ${"downloadSelected"} | ${["some"]}
        `("case $case", ({ downloadMethodName, flatSelectedDocs }) => {
            it("calls $downloadMethodName", async () => {
                ctrl.flatSelectedDocs = { value: flatSelectedDocs };
                const BLOB = "BLOB" as unknown as Blob;
                vi.mocked(ctrl[downloadMethodName]).mockResolvedValueOnce(BLOB);
                await ctrl.download();
                expect(ctrl[downloadMethodName]).toHaveBeenCalled();
            });

            it("calls documentHelper.download with blob from $downloadMethodName", async () => {
                ctrl.flatSelectedDocs = { value: flatSelectedDocs };
                const BLOB = "BLOB" as unknown as Blob;
                vi.mocked(ctrl[downloadMethodName]).mockResolvedValueOnce(BLOB);
                await ctrl.download();
                expect(documentHelper.download).toHaveBeenCalledWith(BLOB, "documents_RNA.zip");
            });
        });

        it("if download is quicker than 750 ms, does not set zipPromise", async () => {
            const zipSetSpy = vi.spyOn(ctrl.zipPromise, "set");
            vi.useFakeTimers();
            vi.mocked(ctrl.downloadAll).mockReturnValueOnce(new Promise(resolve => setTimeout(resolve, 500)));

            const test = ctrl.download();
            vi.advanceTimersByTime(600);
            expect(zipSetSpy).not.toHaveBeenCalled();
            vi.runAllTimers();
            await test;
            vi.useRealTimers();
        });

        it("if download is slower than 750 ms, sets zipPromise", async () => {
            const zipSetSpy = vi.spyOn(ctrl.zipPromise, "set");
            vi.useFakeTimers();
            vi.mocked(ctrl.downloadAll).mockReturnValueOnce(new Promise(resolve => setTimeout(resolve, 2000)));

            const test = ctrl.download();
            vi.advanceTimersByTime(800);
            expect(zipSetSpy).toHaveBeenCalled();
            vi.runAllTimers();
            await test;
            vi.useRealTimers();
        });
    });

    describe("downloadAll", () => {
        const DOCS = "test" as unknown as DocumentEntity[];

        beforeAll(() => {
            // @ts-expect-error - mock
            vi.mocked(documentService.getAllDocs).mockResolvedValue("");
        });

        afterAll(() => {
            vi.mocked(documentService.getAllDocs).mockRestore();
        });

        it("gets docs' blob for all docs", async () => {
            ctrl.allFlatDocs = DOCS;
            await ctrl.downloadAll();
            expect(documentService.getSomeDocs).toHaveBeenCalledWith(DOCS);
            resetController();
        });

        it("returns blob from documentService", async () => {
            const BLOB = "BLOB" as unknown as Blob;
            vi.mocked(documentService.getSomeDocs).mockResolvedValueOnce(BLOB);
            const expected = BLOB;
            const actual = await ctrl.downloadAll();
            expect(actual).toBe(expected);
        });
    });

    describe("downloadSelected", () => {
        const DOCS = "test" as unknown as DocumentEntity[];

        beforeAll(() => {
            // @ts-expect-error - mock
            vi.mocked(documentService.getAllDocs).mockResolvedValue("");
        });

        afterAll(() => {
            vi.mocked(documentService.getAllDocs).mockRestore();
        });

        it("gets docs' blob for selected docs", async () => {
            vi.spyOn(ctrl.flatSelectedDocs, "value", "get").mockReturnValueOnce(DOCS);
            await ctrl.downloadSelected();
            expect(documentService.getSomeDocs).toHaveBeenCalledWith(DOCS);
            resetController();
        });

        it("returns blob from documentService", async () => {
            const BLOB = "BLOB" as unknown as Blob;
            vi.mocked(documentService.getSomeDocs).mockResolvedValueOnce(BLOB);
            const expected = BLOB;
            const actual = await ctrl.downloadSelected();
            expect(actual).toBe(expected);
        });
    });
});
