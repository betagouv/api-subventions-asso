import { DocumentsController } from "$lib/components/Documents/Documents.controller";
import associationService from "$lib/resources/associations/association.service";
import establishmentService from "$lib/resources/establishments/establishment.service";
import * as associationStore from "$lib/store/association.store";
import { waitElementIsVisible } from "$lib/helpers/visibilityHelper";

vi.mock("$lib/resources/documents/documents.service");
vi.mock("$lib/resources/associations/association.service");
vi.mock("$lib/resources/establishments/establishment.service");
vi.mock("$lib/store/association.store", () => ({
    currentAssociation: undefined,
}));
vi.mock("$lib/helpers/visibilityHelper");

describe("Documents.controller", () => {
    let ctrl;
    const ASSOCIATION = { rna: "RNA", siren: "SIREN", nic_siege: "NIC" };
    const ESTABLISHMENT = { siret: "SIRET" };

    beforeAll(() => {
        // @ts-expect-error: use partial association
        const ctrlNotSpied = new DocumentsController("association", ASSOCIATION);
        ctrl = Object.create(Object.getPrototypeOf(ctrlNotSpied), Object.getOwnPropertyDescriptors(ctrlNotSpied));

        ctrl._getAssociationDocuments = vi.spyOn(ctrlNotSpied, "_getAssociationDocuments");
        (ctrl._removeDuplicates = vi.spyOn(ctrlNotSpied, "_removeDuplicates")),
            (ctrl._getEstablishmentDocuments = vi.spyOn(ctrlNotSpied, "_getEstablishmentDocuments"));
        ctrl._organizeDocuments = vi.spyOn(ctrlNotSpied, "_organizeDocuments");
        ctrl.onMount = vi.spyOn(ctrlNotSpied, "onMount");

        vi.mocked(associationService).getDocuments.mockResolvedValue([]);
        vi.mocked(establishmentService).getDocuments.mockResolvedValue([]);
        // @ts-expect-error: partial association
        associationStore["currentAssociation"].set(ASSOCIATION);
        // = new Store(ASSOCIATION);
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

        it("filter out docs with siret that are not from siege", async () => {
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([{ __meta__: { siret: "OTHER_SIRET" } }]);
            const expected = 0;
            const actual = (await ctrl._getAssociationDocuments(ASSOCIATION)).length;
            expect(actual).toBe(expected);
        });

        it("keep docs with no siret", async () => {
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([{ __meta__: { siret: undefined } }]);
            const expected = 1;
            const actual = (await ctrl._getAssociationDocuments(ASSOCIATION)).length;
            expect(actual).toBe(expected);
        });

        it("keep docs with siege siret", async () => {
            // @ts-expect-error: use mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([{ __meta__: { siret: "SIRENNIC" } }]);
            const expected = 1;
            const actual = (await ctrl._getAssociationDocuments(ASSOCIATION)).length;
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

        it("calls associationService.getDocuments with SIREN if no RNA", async () => {
            // @ts-expect-error: mock
            associationStore.currentAssociation.value = { ...ASSOCIATION, rna: undefined };
            await ctrl._getEstablishmentDocuments(ESTABLISHMENT);
            expect(associationService.getDocuments).toHaveBeenCalledWith(ASSOCIATION.siren);
            // @ts-expect-error: mock
            associationStore.currentAssociation.value = ASSOCIATION;
        });

        it("filter out docs with siret that are not from given establishment", async () => {
            // @ts-expect-error: mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([{ __meta__: { siret: "OTHER_SIRET" } }]);
            const expected = 0;
            const actual = (await ctrl._getEstablishmentDocuments(ESTABLISHMENT)).length;
            expect(actual).toBe(expected);
        });

        it("keep docs with no siret", async () => {
            // @ts-expect-error: mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([{ __meta__: { siret: undefined } }]);
            const expected = 1;
            const actual = (await ctrl._getEstablishmentDocuments(ESTABLISHMENT)).length;
            expect(actual).toBe(expected);
        });

        it("keep docs with establishment siret", async () => {
            // @ts-expect-error: mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([{ __meta__: { siret: "SIRET" } }]);
            const expected = 1;
            const actual = (await ctrl._getEstablishmentDocuments(ESTABLISHMENT)).length;
            expect(actual).toBe(expected);
        });

        it("calls _removeDuplicates with results from services", async () => {
            const DOC_ASSO = { __meta__: { siret: "SIRET" }, name: "from asso" };
            const DOC_ETAB = { __meta__: { siret: "SIRET" }, name: "from etab" };

            // @ts-expect-error: mock
            vi.mocked(associationService).getDocuments.mockResolvedValueOnce([DOC_ASSO]);
            // @ts-expect-error: mock
            vi.mocked(establishmentService).getDocuments.mockResolvedValueOnce([DOC_ETAB]);

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
                etabDocs: [
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
            it("calls sets documentsPromise _organizeDocuments found docs", async () => {
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
});
