import { DocumentsController } from "$lib/components/Documents/Documents.controller";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import * as associationStore from "$lib/store/association.store";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";
import Store from "$lib/core/Store";
import documentService, { type LabeledDoc } from "$lib/resources/document/document.service";
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

    beforeAll(() => {
        const ctrlNotSpied = new DocumentsController("association", ASSOCIATION);
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
        ctrl.downloadSome = vi.spyOn(ctrlNotSpied, "downloadSome");

        vi.mocked(associationService).getDocuments.mockResolvedValue([]);
        vi.mocked(establishmentService).getDocuments.mockResolvedValue([]);
        // @ts-expect-error: partial association
        associationStore["currentAssociation"] = new Store(ASSOCIATION);
    });

    describe("_getAssociationDocument", () => {
        it("calls associationService.getDocuments with RNA", async () => {
            await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.rna);
        });

        it("calls associationService.getDocuments with SIREN if no RNA", async () => {
            await ctrl._getAssociationDocuments({ ...ASSOCIATION, rna: undefined });
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.siren);
        });

        it("make doc service label docs", async () => {
            const DOCS = [{ __meta__: { siret: "OTHER_SIRET" } }];
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce(DOCS);
            await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(documentService.labelAssoDocsBySiret).toHaveBeenCalledWith(DOCS, "SIRENNIC");
        });

        it("return labeled docs from service", async () => {
            const DOCS = [{ __meta__: { siret: "OTHER_SIRET" } }];
            const expected = [{ label: true }];
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce(DOCS);
            // @ts-expect-error: use mock
            vi.mocked(documentService).labelAssoDocsBySiret.mockResolvedValueOnce(expected as LabeledDoc[]);
            const actual = await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(actual).toEqual(expected);
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
            vi.mocked(documentService.labelAssoDocsBySiret).mockImplementation(d => d as LabeledDoc[]);
        });

        afterAll(() => {
            ctrl._removeDuplicates.mockRestore();
            vi.mocked(documentService.labelAssoDocsBySiret).mockRestore();
        });

        it("calls establishmentService.getDocuments with SIRET", async () => {
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(establishmentService.getDocuments).toHaveBeenCalledWith(ESTABLISHMENT.siret);
        });

        it("calls associationService.getDocuments with RNA", async () => {
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.rna);
        });

        it("calls associationService.getDocuments with SIREN if no RNA", async () => {
            // @ts-expect-error: mock
            associationStore.currentAssociation.value = { ...ASSOCIATION, rna: undefined };
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.siren);
            // @ts-expect-error: mock
            associationStore.currentAssociation.value = ASSOCIATION;
        });

        it("make doc service label docs", async () => {
            const DOCS = [{ __meta__: { siret: "OTHER_SIRET" } }];
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce(DOCS);
            await ctrl._getAssociationDocuments(ASSOCIATION);
            expect(documentService.labelAssoDocsBySiret).toHaveBeenCalledWith(DOCS, "SIRENNIC");
        });

        it("filter out docs with siret that are not from given establishment", async () => {
            const DOCS = [{ __meta__: { siret: "OTHER_SIRET" } }];
            const expected = [{ label: true }];
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce(DOCS);
            // @ts-expect-error: use mock
            vi.mocked(documentService).labelAssoDocsBySiret.mockResolvedValueOnce(expected as LabeledDoc[]);
            const actual = await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(actual).toEqual(expected);
        });

        it("calls _removeDuplicates with results from services", async () => {
            const DOC_ASSO = { __meta__: { siret: "SIRET" }, name: "from asso" };
            const DOC_ETAB = { __meta__: { siret: "SIRET" }, name: "from etab" } as unknown as DocumentEntity;

            const LABELED_DOC_ASSO = {
                __meta__: { siret: "SIRET" },
                name: "from asso",
                showByDefault: true,
            } as unknown as LabeledDoc;
            const LABELED_DOC_ETAB = {
                __meta__: { siret: "SIRET" },
                name: "from etab",
                showByDefault: true,
            } as unknown as LabeledDoc;

            // @ts-expect-error: mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([DOC_ASSO]);
            vi.mocked(establishmentService).getDocuments.mockResolvedValueOnce([DOC_ETAB]);
            vi.mocked(documentService).labelAssoDocsBySiret.mockImplementation(
                ds => ds.map(d => ({ ...d, showByDefault: true })) as LabeledDoc[],
            );

            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(ctrl._removeDuplicates).toHaveBeenCalledWith([LABELED_DOC_ETAB, LABELED_DOC_ASSO]);
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
            { provider: "Dauphin", nom: "Document dauphin", showByDefault: true },
            { provider: "Le Compte Asso", nom: "Document Le Compte Asso", showByDefault: false },
            { provider: "RNA", nom: "Document RNA", showByDefault: true },
            { provider: "Avis de Situation Insee", nom: "Document Avis de Situation Insee", showByDefault: false },
        ];

        it("separates asso docs and etab docs according to default display arg", () => {
            const actual = ctrl._organizeDocuments(DOCS);
            expect(actual).toMatchObject({
                assoDocs: [
                    {
                        nom: "Document RNA",
                        provider: "RNA",
                    },
                ],
                moreAssoDocs: [
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
                ],
                moreEstabDocs: [
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

        it("returns `some` with false if no default shown docs", () => {
            const actual = ctrl._organizeDocuments([
                { provider: "Dauphin", nom: "Document dauphin", showByDefault: false },
            ]).some;
            expect(actual).toBe(false);
        });

        it("returns `fullSome` with false if no docs", () => {
            const actual = ctrl._organizeDocuments([]).fullSome;
            expect(actual).toBe(false);
        });

        it("returns `fullSome` with true if only no default shown docs", () => {
            const actual = ctrl._organizeDocuments([
                { provider: "Dauphin", nom: "Document dauphin", showByDefault: false },
            ]).fullSome;
            expect(actual).toBe(true);
        });

        it("returns `fullSome` with true if default shown docs", () => {
            const actual = ctrl._organizeDocuments([
                { provider: "Dauphin", nom: "Document dauphin", showByDefault: true },
            ]).fullSome;
            expect(actual).toBe(true);
        });

        it.each`
            property | structure | doc | default
            ${"someAsso"} | ${"asso"} | ${{
    provider: "RNA",
    nom: "Document RNA",
    showByDefault: true,
}} | ${true}
            ${"someEstab"} | ${"estab"} | ${{
    provider: "Le Compte Asso",
    nom: "Document Le Compte Asso",
    showByDefault: true,
}} | ${true}
            ${"someAsso"} | ${"asso"} | ${{
    provider: "RNA",
    nom: "Document RNA",
    showByDefault: true,
}} | ${false}
            ${"someEstab"} | ${"estab"} | ${{
    provider: "Le Compte Asso",
    nom: "Document Le Compte Asso",
    showByDefault: true,
}} | ${false}
        `("count in $property' if $structure docs with showByDefault $default", ({ property, doc }) => {
            const actual = ctrl._organizeDocuments([doc])[property];
            expect(actual).toBe(true);
        });
    });

    describe("onMount", () => {
        let getterSpy;

        beforeAll(() => {
            getterSpy = vi.spyOn(ctrl, "_getterByType", "get").mockReturnValue(vi.fn(() => Promise.resolve()));
            vi.mocked(ctrl._organizeDocuments).mockImplementation(vi.fn());
        });

        afterAll(() => {
            getterSpy.mockRestore();
            vi.mocked(ctrl._organizeDocuments).mockRestore();
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
            it("calls sets loadDocsPromise _organizeDocuments found docs", async () => {
                const DOCS = ["DOC1", "DOC2"];
                const mockedGetter = vi.fn((..._args) => Promise.resolve(DOCS));
                getterSpy.mockReturnValueOnce(mockedGetter);
                await ctrl.onMount();
                const documentsPromise = ctrl.documentsPromise.value;
                await documentsPromise;
                expect(ctrl._organizeDocuments).toHaveBeenCalledWith(DOCS);
            });
        });
    });

    describe("download", () => {
        beforeAll(() => {
            vi.mocked(ctrl.downloadAll).mockResolvedValue("");
            vi.mocked(ctrl.downloadSome).mockResolvedValue("");
            vi.mocked(documentHelper.download).mockResolvedValue("");
        });

        afterAll(() => {
            vi.mocked(ctrl.downloadAll).mockRestore("");
            vi.mocked(ctrl.downloadSome).mockRestore("");
            vi.mocked(documentHelper.download).mockRestore("");
        });

        describe.each`
            case               | downloadMethodName | flatSelectedDocs
            ${"download all"}  | ${"downloadAll"}   | ${[]}
            ${"download some"} | ${"downloadSome"}  | ${["some"]}
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
        beforeAll(() => {
            // @ts-expect-error - mock
            vi.mocked(documentService.getAllDocs).mockResolvedValue("");
        });

        afterAll(() => {
            vi.mocked(documentService.getAllDocs).mockRestore();
        });

        it.each`
            identifier
            ${"RNA"}
            ${"SIREN"}
            ${"SIRET"}
        `("gets docs by $identifier", async ({ identifier }) => {
            ctrl.identifier = identifier;
            await ctrl.downloadAll();
            expect(documentService.getAllDocs).toHaveBeenCalledWith(identifier);

            vi.mocked(documentService.getAllDocs).mockClear();
            ctrl.resource = ASSOCIATION;
        });

        it("returns blob from documentService", async () => {
            const BLOB = "BLOB" as unknown as Blob;
            vi.mocked(documentService.getAllDocs).mockResolvedValueOnce(BLOB);
            const expected = BLOB;
            const actual = await ctrl.downloadAll();
            expect(actual).toBe(expected);
        });
    });
});
