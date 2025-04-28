import searchService, { SearchService } from "./search.service";
import searchCachePort from "../../dataProviders/db/search/search.port";
import associationNameService from "../association-name/associationName.service";
import AssociationNameDtoAdapter from "./adapters/AssociationNameDtoAdapter";

jest.mock("../../dataProviders/db/search/search.port");
jest.mock("../association-name/associationName.service");
jest.mock("./adapters/AssociationNameDtoAdapter");

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
            expect(searchCachePort.getResults).toHaveBeenCalledWith(
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
            jest.mocked(searchCachePort.getResults).mockResolvedValue(RES);
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
            jest.mocked(searchCachePort.getResults).mockResolvedValue(null);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(associationNameService.find).toHaveBeenCalledWith(SEARCH_TOKEN);
        });

        it("save found results", async () => {
            const RES = ["something"];
            // @ts-expect-error -- test
            jest.mocked(AssociationNameDtoAdapter.toDto).mockImplementationOnce(x => x);
            jest.mocked(searchCachePort.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(searchCachePort.saveResults).toHaveBeenCalledWith(SEARCH_TOKEN, RES);
        });

        it("return truncated and annotated results", async () => {
            const RES = ["something"];
            jest.mocked(searchCachePort.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(AssociationNameDtoAdapter.toDto).mockImplementationOnce(x => x);
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
            expect(searchCachePort.deleteAll).toHaveBeenCalled();
        });
    });
});
