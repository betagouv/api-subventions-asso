import type { SpyInstance } from "vitest";

import SearchController from "./Search.controller";
import { goto } from "$app/navigation";
vi.mock("$app/navigation");
import * as IdentifierHelper from "$lib/helpers/identifierHelper";

vi.mock("$lib/helpers/identifierHelper");
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);
import associationService from "$lib/resources/associations/association.service";
import { isSiret } from "$lib/helpers/identifierHelper";
import { encodeQuerySearch } from "$lib/helpers/urlHelper";

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
    });

    afterEach(() => {
        mockedIdentifierHelper.isRna.mockReset();
        mockedIdentifierHelper.isSiren.mockReset();
    });

    describe("fetchAssociationFromName()", () => {
        it("should set duplicate store", async () => {
            const expected = [RNA_SIREN_1.siren, RNA_SIREN_2.siren];
            mockedIdentifierHelper.isRna.mockReturnValue(true);
            const controller = new SearchController(RNA);
            await new Promise(process.nextTick);
            const actual = controller.duplicatesFromIdentifier.value;
            expect(actual).toEqual(expected);
            mockedIdentifierHelper.isRna.mockReset();
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
        let goToEstabSpy: SpyInstance;
        let fetchSpy: SpyInstance;

        beforeAll(() => {
            controller = new SearchController(RNA);
            goToEstabSpy = vi.spyOn(controller, "gotoEstablishment");
            // @ts-expect-error -- mock
            fetchSpy = vi.spyOn(controller, "fetchAssociationFromName").mockResolvedValue(null);
        });

        afterAll(() => {
            fetchSpy.mockRestore();
        });

        it("if input is siret, call goToEstablishment", () => {
            vi.mocked(isSiret).mockReturnValueOnce(true);
            controller.onSubmit(RNA);
            expect(goToEstabSpy).toHaveBeenCalledWith(RNA);
            expect(fetchSpy).not.toHaveBeenCalled();
        });

        it("if input is not siret, fetch new result on page one", () => {
            vi.mocked(isSiret).mockReturnValueOnce(false);
            controller.onSubmit(RNA);
            expect(fetchSpy).toHaveBeenCalledWith(RNA, 1);
        });
    });
});
