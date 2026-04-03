import searchService, { SearchService } from "./search.service";
import searchCacheAdapter from "../../adapters/outputs/db/search/search.adapter";
import associationNameService from "../association-name/associationName.service";
import AssociationNameDtoMapper from "./mappers/association-name-dto.mapper";

jest.mock("../../adapters/outputs/db/search/search.adapter");
jest.mock("../association-name/associationName.service");
jest.mock("./mappers/association-name-dto.mapper");

describe("SearchService", () => {
    describe("getAssociationsKeys", () => {
        const SEARCH_TOKEN = "recherche";
        const PAGE = 2;

        beforeAll(() => {
            jest.mocked(associationNameService.find).mockResolvedValue([]);
        });

        afterAll(() => {
            jest.mocked(associationNameService.find).mockRestore();
        });

        it("get results from cache port", async () => {
            const DATE_NOW = new Date(2024, 0, 2);
            jest.useFakeTimers();
            jest.setSystemTime(DATE_NOW);
            const LIMIT_DATE = new Date(2024, 0, 1);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(searchCacheAdapter.getResults).toHaveBeenCalledWith(
                SEARCH_TOKEN,
                PAGE,
                SearchService.PAGE_SIZE,
                LIMIT_DATE,
            );
            jest.useRealTimers();
        });

        it("returns results from cache if any", async () => {
            const RES = { results: ["something"], total: 1 };
            // @ts-expect-error -- test
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(RES);
            const actual = await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(actual).toMatchInlineSnapshot(`
                {
                  "nbPages": 1,
                  "page": 2,
                  "results": [
                    "something",
                  ],
                  "total": 1,
                }
            `);
        });

        it("gets fresh result if nothing from cache", async () => {
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(associationNameService.find).toHaveBeenCalledWith(SEARCH_TOKEN);
        });

        it("save found results", async () => {
            const RES = ["something"];
            // @ts-expect-error -- test
            jest.mocked(AssociationNameDtoMapper.toDto).mockImplementationOnce(x => x);
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(searchCacheAdapter.saveResults).toHaveBeenCalledWith(SEARCH_TOKEN, RES);
        });

        it("return truncated and annotated results", async () => {
            const RES = ["something"];
            jest.mocked(searchCacheAdapter.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(AssociationNameDtoMapper.toDto).mockImplementationOnce(x => x);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            const actual = await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(actual).toMatchInlineSnapshot(`
                {
                  "nbPages": 1,
                  "page": 2,
                  "results": [],
                  "total": 1,
                }
            `);
        });
    });

    describe("cleanCache", () => {
        it("calls service", async () => {
            await searchService.cleanCache();
            expect(searchCacheAdapter.deleteAll).toHaveBeenCalled();
        });
    });
});
