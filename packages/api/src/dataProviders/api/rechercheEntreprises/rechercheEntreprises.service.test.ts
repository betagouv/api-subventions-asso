import { NotificationType } from "../../../modules/notify/@types/NotificationType";
import { RechercheEntreprisesDto, RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";
import Siren from "../../../identifierObjects/Siren";
import rechercheEntreprisesService from "./rechercheEntreprises.service";
import rechercheEntreprisesPort from "./rechercheEntreprises.port";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";
import notifyService from "../../../modules/notify/notify.service";
import { RNA_STR, SIREN_STR } from "../../../../tests/__fixtures__/association.fixture";

// Mocking the external dependencies
jest.mock("./RechercheEntreprisesAdapter");
jest.mock("./rechercheEntreprises.port");
jest.mock("../../../modules/notify/notify.service", () => ({
    notify: jest.fn(),
}));

describe("RechercheEntreprisesService", () => {
    const SIREN = new Siren("123456789");
    const NAME = "Bridge Familly";

    describe("getSearchResult", () => {
        const RESULTS = [
            { nom_complet: "EXAMPLE 1", siren: SIREN.value },
            { nom_complet: "EXAMPLE 2", siren: "90000999" },
        ];

        const ASSO_NAME_ENTITY = { name: "Adapted Association Name" };

        let mockSearch: jest.SpyInstance;
        let mockNotifyOrNot: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: mock return value
            jest.spyOn(RechercheEntreprisesAdapter, "toAssociationNameEntity").mockReturnValue({
                name: "Adapted Association Name",
            });
            mockSearch = jest.spyOn(rechercheEntreprisesService, "search").mockResolvedValue(RESULTS);
            // @ts-expect-error: mock private method
            mockNotifyOrNot = jest.spyOn(rechercheEntreprisesService, "notifyOrNot").mockImplementation(jest.fn());
        });

        afterAll(() => {
            mockSearch.mockRestore();
            mockNotifyOrNot.mockRestore();
        });

        it("fetch results from API", async () => {
            await rechercheEntreprisesService.getSearchResult(SIREN.value);
            expect(mockSearch).toHaveBeenCalledWith(SIREN.value);
        });

        // should be deleted in a few month (~ april 2026) if no notification received
        it("notify or not the team", async () => {
            await rechercheEntreprisesService.getSearchResult(SIREN.value);
            expect(mockNotifyOrNot).toHaveBeenCalledTimes(1);
        });

        it("adapts all result to AssociationNameEntity", async () => {
            await rechercheEntreprisesService.getSearchResult(SIREN.value);
            RESULTS.forEach((result, index) => {
                expect(RechercheEntreprisesAdapter.toAssociationNameEntity).toHaveBeenNthCalledWith(index + 1, result);
            });
        });

        it("returns AssociationNameEntities", async () => {
            const expected = [ASSO_NAME_ENTITY, ASSO_NAME_ENTITY];
            const actual = await rechercheEntreprisesService.getSearchResult(SIREN.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("search", () => {
        const FIRST_PAGE_RESULTS: RechercheEntreprisesResultDto[] = [
            { nom_complet: NAME, siren: SIREN.value },
            { nom_complet: undefined, siren: "987654321" },
        ];

        const SECOND_PAGE_RESULTS = [{ nom_complet: "Antibes Bridge", siren: "900009999" }];

        const RESPONSE_DETAILS = {
            total_pages: 2,
            page: 1,
            per_page: 2,
            total_results: 3,
        };

        const FIRST_PAGE_RESPONSE: RechercheEntreprisesDto = {
            ...RESPONSE_DETAILS,
            results: [...FIRST_PAGE_RESULTS],
        };

        const SECOND_PAGE_RESPONSE: RechercheEntreprisesDto = {
            ...{ ...RESPONSE_DETAILS, page: 2 },
            results: [...SECOND_PAGE_RESULTS],
        };

        let mockRequestNextPage: jest.SpyInstance;
        let spySearch: jest.SpyInstance;

        beforeEach(() => {
            spySearch = jest.spyOn(rechercheEntreprisesService, "search");
            // @ts-expect-error: mock private method
            mockRequestNextPage = jest.spyOn(rechercheEntreprisesService, "requestNextPage");

            // simulate two page response
            mockRequestNextPage.mockReturnValueOnce(true);
            mockRequestNextPage.mockReturnValueOnce(false);
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(FIRST_PAGE_RESPONSE);
            jest.mocked(rechercheEntreprisesPort.search).mockResolvedValueOnce(SECOND_PAGE_RESPONSE);
        });

        afterEach(() => {
            spySearch.mockClear();
        });

        afterAll(() => {
            mockRequestNextPage.mockRestore();
            spySearch.mockRestore();
        });

        it("calls itself recursively when requestNextPage", async () => {
            await rechercheEntreprisesService.search("Bridge");
            expect(spySearch).toHaveBeenCalledTimes(2);
        });

        it("returns concatened results from recursivity", async () => {
            const actual = await rechercheEntreprisesService.search("Bridge");
            const expected = [...SECOND_PAGE_RESULTS, ...FIRST_PAGE_RESULTS];
            expect(actual.length).toEqual(expected.length);
        });
    });

    describe("requestNextPage", () => {
        it("returns true when response.page is lower than response.total_pages ", () => {
            const expected = true;
            // @ts-expect-error: private method
            const actual = rechercheEntreprisesService.requestNextPage({ total_pages: 2, page: 1 });
            expect(actual).toEqual(expected);
        });

        it("returns false if current page equals the maximum of pages requested (3)", () => {
            const expected = false;
            // @ts-expect-error: private method
            const actual = rechercheEntreprisesService.requestNextPage({ total_pages: 4, page: 3 });
            expect(actual).toEqual(expected);
        });

        it("returns false if response.page equals response.total_pages", () => {
            const expected = false;
            // @ts-expect-error: private method
            const actual = rechercheEntreprisesService.requestNextPage({ total_pages: 2, page: 2 });
            expect(actual).toEqual(expected);
        });
    });

    /**
     * low test coverage because it should be deleted soon
     */
    describe("notifyOrNot", () => {
        it("calls notify", () => {
            const spyNotify = jest.spyOn(notifyService, "notify");
            const ERRORS = [
                {
                    nature_juridique: "9400",
                    siren: SIREN_STR,
                    nom_complet: "Example with NatureJuridique not from LEGAL_CATEGORIES_ACCEPTED",
                },
            ];
            const QUERY = RNA_STR;
            // @ts-expect-error: private method
            rechercheEntreprisesService.notifyOrNot(ERRORS, QUERY);
            expect(spyNotify).toHaveBeenCalledWith(NotificationType.EXTERNAL_API_ERROR, {
                message:
                    "API Recherche Entreprise retourne des structures non association malgré leur filtre sur la nature juridique",
                details: {
                    apiName: rechercheEntreprisesService.meta.name,
                    queryParams: [{ name: "q", value: QUERY }],
                    examples: ERRORS.slice(0, 4).map(error => ({
                        siren: error.siren,
                        nom: error.nom_complet,
                        natureJuridique: error.nature_juridique,
                    })),
                },
            });
        });
    });
});
