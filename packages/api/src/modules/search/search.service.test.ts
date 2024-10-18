import searchService, { SearchService } from "./search.service";
import searchCacheRepository from "./repositories/search.repository";
import associationNameService from "../association-name/associationName.service";
import AssociationNameDtoAdapter from "./adapters/AssociationNameDtoAdapter";

jest.mock("./repositories/search.repository");
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

        it("get results from cache repo", async () => {
            const DATE_NOW = new Date(2024, 0, 2);
            jest.useFakeTimers();
            jest.setSystemTime(DATE_NOW);
            const LIMIT_DATE = new Date(2024, 0, 1);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(searchCacheRepository.getResults).toHaveBeenCalledWith(
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
            jest.mocked(searchCacheRepository.getResults).mockResolvedValue(RES);
            const actual = await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "nbPages": 1,
                  "page": 2,
                  "results": Array [
                    "something",
                  ],
                  "total": 1,
                }
            `);
        });

        it("gets fresh result if nothing from cache", async () => {
            jest.mocked(searchCacheRepository.getResults).mockResolvedValue(null);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(associationNameService.find).toHaveBeenCalledWith(SEARCH_TOKEN);
        });

        it("save found results", async () => {
            const RES = ["something"];
            // @ts-expect-error -- test
            jest.mocked(AssociationNameDtoAdapter.toDto).mockImplementationOnce(x => x);
            jest.mocked(searchCacheRepository.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(searchCacheRepository.saveResults).toHaveBeenCalledWith(SEARCH_TOKEN, RES);
        });

        it("return truncated and annotated results", async () => {
            const RES = ["something"];
            jest.mocked(searchCacheRepository.getResults).mockResolvedValue(null);
            // @ts-expect-error -- test
            jest.mocked(AssociationNameDtoAdapter.toDto).mockImplementationOnce(x => x);
            // @ts-expect-error -- test
            jest.mocked(associationNameService.find).mockResolvedValue(RES);
            const actual = await searchService.getAssociationsKeys(SEARCH_TOKEN, PAGE);
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "nbPages": 1,
                  "page": 2,
                  "results": Array [],
                  "total": 1,
                }
            `);
        });
    });

    describe("cleanCache", () => {
        it("calls service", async () => {
            await searchService.cleanCache();
            expect(searchCacheRepository.deleteAll).toHaveBeenCalled();
        });
    });
});
