import { afterAll, beforeAll, beforeEach, type MockInstance } from "vitest";

import SearchController from "./Search.controller";

vi.mock("$app/navigation");
import * as IdentifierHelper from "$lib/helpers/identifierHelper";

vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);

import associationService from "$lib/resources/associations/association.service";
import { decodeQuerySearch, encodeQuerySearch } from "$lib/helpers/urlHelper";
import { goto } from "$app/navigation";
import { SearchSort } from "dto";

vi.mock("$lib/resources/associations/association.service");
const mockedAssociationService = vi.mocked(associationService);
vi.mock("$lib/helpers/urlHelper");
vi.mock("$lib/helpers/identifierHelper");
vi.mock("$app/navigation");

describe("SearchController", () => {
    const RNA = "RNA";
    const RNA_SIREN_1 = {
        rna: RNA,
        siren: "SIREN_1",
        siretSiege: null,
        name: "NOM",
        adresse: null,
        nbEtabs: null,
    };
    const RNA_SIREN_2 = {
        rna: RNA,
        siren: "SIREN_2",
        siretSiege: null,
        name: "NOM",
        adresse: null,
        nbEtabs: null,
    };
    const DUPLICATED_RESULTS = {
        nbPages: 1,
        page: 1,
        results: [RNA_SIREN_1, RNA_SIREN_2],
        total: 2,
    };
    beforeAll(() => {
        mockedAssociationService.search.mockResolvedValue(DUPLICATED_RESULTS);
        vi.mocked(decodeQuerySearch).mockImplementation(v => v);
    });

    afterAll(() => {
        mockedAssociationService.search.mockRestore();
        vi.mocked(decodeQuerySearch).mockRestore();
    });

    describe("fetchAssociations()", () => {
        let controller;

        beforeEach(async () => {
            controller = new SearchController(RNA);
            await new Promise(process.nextTick);
        });

        it("searches with trimmed input", async () => {
            controller.inputSearch.value = `  ${RNA}  `;
            await controller.fetchAssociations();
            expect(mockedAssociationService.search).toHaveBeenCalledWith(RNA, {
                page: 1,
                postalCode: undefined,
                sort: SearchSort.RELEVANCE,
                nameOnly: false,
            });
        });

        it("should set duplicate store", async () => {
            mockedIdentifierHelper.isRna.mockReturnValue(true);
            await controller.fetchAssociations();
            mockedIdentifierHelper.isRna.mockRestore();
            expect(controller.duplicatesFromIdentifier.value).toEqual([RNA_SIREN_1.siren, RNA_SIREN_2.siren]);
        });

        it("displays a single identifier result instead of redirecting", async () => {
            const singleResult = { ...DUPLICATED_RESULTS, results: [RNA_SIREN_1], total: 1 };
            mockedAssociationService.search.mockResolvedValueOnce(singleResult);
            mockedIdentifierHelper.isRna.mockReturnValueOnce(true);
            vi.mocked(encodeQuerySearch).mockReturnValueOnce(RNA);

            await controller.fetchAssociations();

            expect(controller.searchResults.value).toEqual(singleResult);
            expect(vi.mocked(goto)).toHaveBeenLastCalledWith(`/search/${RNA}`, { replaceState: true });
        });

        it("should unset duplicate store on second search, with name", async () => {
            mockedIdentifierHelper.isRna.mockReturnValueOnce(false);
            controller.inputSearch.value = "name";
            await controller.fetchAssociations();
            expect(controller.duplicatesFromIdentifier.value).toBeNull();
        });

        it("should call with required page", async () => {
            controller.inputSearch.value = "name";
            await controller.fetchAssociations(42);
            expect(mockedAssociationService.search).toHaveBeenCalledWith("name", {
                page: 42,
                postalCode: undefined,
                sort: SearchSort.RELEVANCE,
                nameOnly: false,
            });
        });

        it("should call with postal code", async () => {
            controller.inputSearch.value = "name";
            controller.postalCode.value = "93400";
            await controller.fetchAssociations();
            expect(mockedAssociationService.search).toHaveBeenCalledWith("name", {
                page: 1,
                postalCode: "93400",
                sort: SearchSort.RELEVANCE,
                nameOnly: false,
            });
        });

        it("should keep search options in url", () => {
            controller.inputSearch.value = "name";
            controller.postalCode.value = "43000";
            controller.selectedSort.value = SearchSort.ALPHABETICAL;
            controller.nameOnly.value = true;
            vi.mocked(encodeQuerySearch).mockReturnValueOnce("encoded");

            expect(controller.getSearchUrl()).toBe("/search/encoded?postalCode=43000&sort=alphabetical&nameOnly=true");
        });

        it("sets isLastSearchCompany to true if raised exception", async () => {
            vi.mocked(mockedAssociationService.search).mockRejectedValueOnce({ httpCode: 422 });
            await controller.fetchAssociations();
            expect(controller.isLastSearchCompany.value).toBe(true);
        });
    });

    describe("onSubmit", () => {
        let controller: SearchController;
        let fetchSpy: MockInstance;

        beforeAll(() => {
            controller = new SearchController(RNA);
            fetchSpy = vi.spyOn(controller, "fetchAssociations").mockResolvedValue();
        });

        afterAll(() => fetchSpy.mockRestore());

        it("fetch new result on page one", () => {
            controller.onSubmit(RNA);
            expect(fetchSpy).toHaveBeenCalledWith();
        });

        it("fetch new result with filters on page one", () => {
            controller.onSubmit(RNA, "93", true);
            expect(controller.postalCode.value).toBe("93");
            expect(controller.nameOnly.value).toBe(true);
            expect(fetchSpy).toHaveBeenCalledWith();
        });
    });

    describe("selectPage", () => {
        it("fetches search results with selected page", () => {
            const controller = new SearchController(RNA);
            const fetchSpy = vi.spyOn(controller, "fetchAssociations").mockResolvedValue();
            controller.selectPage(5);
            expect(fetchSpy).toHaveBeenCalledWith(5);
        });
    });

    describe("selectSort", () => {
        it("fetches first page with selected sort", () => {
            const controller = new SearchController(RNA);
            const fetchSpy = vi.spyOn(controller, "fetchAssociations").mockResolvedValue();
            controller.selectSort(SearchSort.ALPHABETICAL);
            expect(controller.selectedSort.value).toBe(SearchSort.ALPHABETICAL);
            expect(fetchSpy).toHaveBeenCalledWith();
        });
    });
});
