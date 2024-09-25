import { afterAll, beforeAll, type SpyInstance } from "vitest";

import SearchController from "./Search.controller";

vi.mock("$app/navigation");
import * as IdentifierHelper from "$lib/helpers/identifierHelper";

vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);
import associationService from "$lib/resources/associations/association.service";
import { isSiret } from "$lib/helpers/identifierHelper";
import { decodeQuerySearch } from "$lib/helpers/urlHelper";

vi.mock("$lib/resources/associations/association.service");
const mockedAssociationService = vi.mocked(associationService);
vi.mock("$lib/helpers/urlHelper");
vi.mock("$lib/helpers/identifierHelper");
vi.mock("$app/navigation");

describe("SearchController", () => {
    const RNA = "RNA";
    const RNA_SIREN_1 = { rna: RNA, siren: "SIREN_1", name: "NOM" };
    const RNA_SIREN_2 = { rna: RNA, siren: "SIREN_2", name: "NOM" };
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

    describe("fetchAssociationFromName()", () => {
        it("if input is siret, call goToEstablishment", async () => {
            vi.mocked(isSiret).mockReturnValueOnce(true);
            const SIRET = "12345678901234";
            const controller = new SearchController(RNA);
            mockedIdentifierHelper.isSiret.mockReturnValueOnce(true);
            const goToEstabSpy = vi.spyOn(controller, "gotoEstablishment");
            await controller.fetchAssociationFromName(SIRET);
            expect(goToEstabSpy).toHaveBeenCalledWith(SIRET);
        });

        it("searches with trimmed input", async () => {
            const PAGE = 1;
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            await controller.fetchAssociationFromName("  " + RNA + "  ");
            expect(mockedAssociationService.search).toHaveBeenCalledWith(RNA, PAGE);
        });

        it("should set duplicate store", async () => {
            const expected = [RNA_SIREN_1.siren, RNA_SIREN_2.siren];
            mockedIdentifierHelper.isRna.mockReturnValue(true);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            const actual = controller.duplicatesFromIdentifier.value;
            mockedIdentifierHelper.isRna.mockRestore();
            expect(actual).toEqual(expected);
        });

        it("should unset duplicate store on second search, with name", async () => {
            const expected = null;
            mockedIdentifierHelper.isRna.mockReturnValueOnce(true);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            await controller.fetchAssociationFromName("name");
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
        });

        it("should call with required page", async () => {
            const PAGE = 42;
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            await controller.fetchAssociationFromName("name", PAGE);
            expect(mockedAssociationService.search).toHaveBeenCalledWith("name", PAGE);
        });

        it("should call with default page", async () => {
            const PAGE = 1;
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            await controller.fetchAssociationFromName("name");
            expect(mockedAssociationService.search).toHaveBeenCalledWith("name", PAGE);
        });

        it("should call goto with encoded input", async () => {
            const PAGE = 1;
            mockedIdentifierHelper.isRna.mockReturnValue(false);
            mockedIdentifierHelper.isSiren.mockReturnValue(false);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            await controller.fetchAssociationFromName("name");
            expect(mockedAssociationService.search).toHaveBeenCalledWith("name", PAGE);
        });
    });

    describe("onSubmit", () => {
        let controller: SearchController;
        let fetchSpy: SpyInstance;

        beforeAll(() => {
            controller = new SearchController(RNA);
            // @ts-expect-error -- mock
            fetchSpy = vi.spyOn(controller, "fetchAssociationFromName").mockResolvedValue(null);
        });

        afterAll(() => {
            fetchSpy.mockRestore();
        });

        it("fetch new result on page one", () => {
            vi.mocked(isSiret).mockReturnValueOnce(false);
            controller.onSubmit(RNA);
            expect(fetchSpy).toHaveBeenCalledWith(RNA, 1);
        });
    });

    describe("onChangePage", () => {
        let fetchSpy;

        it("fetches search results with page from event", () => {
            const PAGE = 5;
            const SEARCH = "search";
            const controller = new SearchController(RNA);
            fetchSpy = vi.spyOn(controller, "fetchAssociationFromName").mockReturnValue(Promise.resolve());
            controller.inputSearch.value = SEARCH;
            controller.onChangePage({ detail: PAGE });
            expect(fetchSpy).toHaveBeenCalledWith(SEARCH, PAGE);
        });
    });
});
