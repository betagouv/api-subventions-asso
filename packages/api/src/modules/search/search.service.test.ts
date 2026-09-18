import searchService from "./search.service";
import searchCacheAdapter from "../../adapters/outputs/db/search/search.adapter";
import associationNameService from "../association-name/associationName.service";

jest.mock("../../adapters/outputs/db/search/search.adapter");
jest.mock("../association-name/associationName.service");

describe("SearchService", () => {
    describe("getAssociationsKeys", () => {
        const SEARCH_TOKEN = "recherche";
        const RES = ["something"];

        beforeEach(() => {
            // @ts-expect-error: mock return value
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(RES);
            jest.mocked(associationNameService.find).mockResolvedValue([]);
        });

        it("get results from cache port", async () => {
            const DATE_NOW = new Date(2024, 0, 2);
            jest.useFakeTimers();
            jest.setSystemTime(DATE_NOW);
            const LIMIT_DATE = new Date(2024, 0, 1);
            await searchService.getAssociationsKeys(SEARCH_TOKEN);
            expect(searchCacheAdapter.getResults).toHaveBeenCalledWith(SEARCH_TOKEN, LIMIT_DATE);
            jest.useRealTimers();
        });

        it("returns results from cache if any", async () => {
            const expected = RES;
            const actual = await searchService.getAssociationsKeys(SEARCH_TOKEN);
            expect(actual).toEqual(expected);
        });

        it("gets fresh result if nothing from cache", async () => {
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            await searchService.getAssociationsKeys(SEARCH_TOKEN);
            expect(associationNameService.find).toHaveBeenCalledWith(SEARCH_TOKEN);
        });

        it("save found results", async () => {
            const RES = ["something"];
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            await searchService.getAssociationsKeys(SEARCH_TOKEN);
            expect(searchCacheAdapter.saveResults).toHaveBeenCalledWith(SEARCH_TOKEN, RES);
        });

        it("return results", async () => {
            const RES = ["something"];
            const expected = RES;
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            const actual = await searchService.getAssociationsKeys(SEARCH_TOKEN);
            expect(actual).toEqual(expected);
        });
    });

    describe("cleanCache", () => {
        it("calls service", async () => {
            await searchService.cleanCache();
            expect(searchCacheAdapter.deleteAll).toHaveBeenCalled();
        });
    });
});
