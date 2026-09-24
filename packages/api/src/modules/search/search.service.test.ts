import { SearchService } from "./search.service";
import searchCacheAdapter from "../../adapters/outputs/db/search/search.adapter";
import { BadRequestError } from "core";
import { Search } from "../../usecases/search/search";

jest.mock("../../adapters/outputs/db/search/search.adapter");

describe("SearchService", () => {
    const RES = ["something"];
    const mockSearch = { execute: jest.fn().mockResolvedValue(RES) } as unknown as Search;
    let service: SearchService;

    beforeEach(() => {
        service = new SearchService(mockSearch);
        // @ts-expect-error: mock return value
        jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(RES);
    });

    describe("getAssociationsKeys", () => {
        const SEARCH_TOKEN = "recherche";

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
            expect(mockSearch.execute).toHaveBeenCalledWith({ value: SEARCH_TOKEN, postalCode: undefined });
        });

        it("uses postal code in cache key", async () => {
            jest.clearAllMocks();
            const DATE_NOW = new Date(2024, 0, 2);
            jest.useFakeTimers();
            jest.setSystemTime(DATE_NOW);
            await service.getAssociationsKeys(SEARCH_TOKEN, "75");
            jest.useRealTimers();
            expect(searchCacheAdapter.getResults).toHaveBeenCalledWith(
                `${SEARCH_TOKEN}__postalCode:75`,
                new Date(2024, 0, 1),
            );
        });

        it("throws BadRequestError for invalid postal code", async () => {
            await expect(service.getAssociationsKeys(SEARCH_TOKEN, "7A")).rejects.toThrow(BadRequestError);
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

    describe("cleanCache", () => {
        it("calls service", async () => {
            await service.cleanCache();
            expect(searchCacheAdapter.deleteAll).toHaveBeenCalled();
        });
    });
});
