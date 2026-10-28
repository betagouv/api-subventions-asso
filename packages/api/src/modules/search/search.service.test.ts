import { SearchService } from "./search.service";
import searchCacheAdapter from "../../adapters/outputs/db/search/search.adapter";
import { BadRequestError } from "core";
import { Search } from "../../usecases/search/search";
import { SearchSort } from "dto";
import AssociationSearchEntity from "../../entities/AssociationSearchEntity";

jest.mock("../../adapters/outputs/db/search/search.adapter");

describe("SearchService", () => {
    const SEARCH_TOKEN = "recherche";
    const RES = ["something"];
    const mockSearch = { execute: jest.fn().mockResolvedValue(RES) } as unknown as Search;
    let service: SearchService;

    beforeEach(() => {
        service = new SearchService(mockSearch);
        // @ts-expect-error: mock return value
        jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(RES);
    });

    describe("getAssociationsKeys", () => {
        it("get results from cache port", async () => {
            const DATE_NOW = new Date(2024, 0, 2);
            jest.useFakeTimers();
            jest.setSystemTime(DATE_NOW);
            const LIMIT_DATE = new Date(2024, 0, 1);
            await service.getAssociationsKeys(SEARCH_TOKEN);
            expect(searchCacheAdapter.getResults).toHaveBeenCalledWith(SEARCH_TOKEN, LIMIT_DATE);
            jest.useRealTimers();
        });

        it("returns results from cache if any", async () => {
            const expected = RES;
            const actual = await service.getAssociationsKeys(SEARCH_TOKEN);
            expect(actual).toEqual(expected);
        });

        it("gets fresh result if nothing from cache", async () => {
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            await service.getAssociationsKeys(SEARCH_TOKEN);
            expect(mockSearch.execute).toHaveBeenCalledWith({
                value: SEARCH_TOKEN,
                postalCode: undefined,
                nameOnly: false,
            });
        });

        it("uses postal code and name-only in cache key", async () => {
            jest.clearAllMocks();
            const DATE_NOW = new Date(2024, 0, 2);
            jest.useFakeTimers();
            jest.setSystemTime(DATE_NOW);
            await service.getAssociationsKeys(SEARCH_TOKEN, { postalCode: "75", nameOnly: true });
            jest.useRealTimers();
            expect(searchCacheAdapter.getResults).toHaveBeenCalledWith(
                `${SEARCH_TOKEN}__postalCode:75__nameOnly:true`,
                new Date(2024, 0, 1),
            );
        });

        it("throws BadRequestError for invalid postal code", async () => {
            await expect(service.getAssociationsKeys(SEARCH_TOKEN, { postalCode: "7A" })).rejects.toThrow(
                BadRequestError,
            );
        });

        it("save found results", async () => {
            const RES = ["something"];
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            await service.getAssociationsKeys(SEARCH_TOKEN);
            expect(searchCacheAdapter.saveResults).toHaveBeenCalledWith(SEARCH_TOKEN, RES);
        });

        it("return results", async () => {
            const RES = ["something"];
            const expected = RES;
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            const actual = await service.getAssociationsKeys(SEARCH_TOKEN);
            expect(actual).toEqual(expected);
        });
    });

    describe("getPaginatedResult", () => {
        it("sorts results alphabetically", async () => {
            const A = { name: { rna: "Aa" } } as AssociationSearchEntity;
            const B = { name: { sirene: "Bb" } } as AssociationSearchEntity;
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValueOnce([B, A]);
            const actual = await service.getPaginatedResult(SEARCH_TOKEN, { sort: SearchSort.ALPHABETICAL });
            expect(actual.results).toEqual([A, B]);
        });
    });

    describe("cleanCache", () => {
        it("calls service", async () => {
            await service.cleanCache();
            expect(searchCacheAdapter.deleteAll).toHaveBeenCalled();
        });
    });
});
