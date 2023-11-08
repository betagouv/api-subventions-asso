import localStorageService from "./localStorage.service";
vi.mock("./localStorage.service");
const mockedLocalStorageService = vi.mocked(localStorageService);
import * as SearchHistoryService from "./searchHistory.service";

describe("SearchHistoryService", () => {
    const RNA = "W123456789";
    const RNA_2 = "W987654321";
    const RNA_3 = "W135792468";
    const RNA_4 = "W246813579";

    afterEach(() => {
        mockedLocalStorageService.getItem.mockReset();
        mockedLocalStorageService.setItem.mockReset();
    });

    it("should save first search history", () => {
        const FIRST_SEARCH = { rna: RNA };
        // @ts-expect-error: mock
        mockedLocalStorageService.getItem.mockReturnValueOnce({ value: [] });
        SearchHistoryService.updateSearchHistory(FIRST_SEARCH);
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith("search-history", [FIRST_SEARCH]);
    });

    it("should save second search history", () => {
        const FIRST_SEARCH = { rna: RNA };
        const SECOND_SEARCH = { rna: RNA_2 };
        // @ts-expect-error: mock
        mockedLocalStorageService.getItem.mockReturnValueOnce({ value: [FIRST_SEARCH] });
        SearchHistoryService.updateSearchHistory(SECOND_SEARCH);
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith("search-history", [FIRST_SEARCH, SECOND_SEARCH]);
    });

    it("should save third search history", () => {
        const FIRST_SEARCH = { rna: RNA };
        const SECOND_SEARCH = { rna: RNA_2 };
        const THIRD_SEARCH = { rna: RNA_3 };
        // @ts-expect-error: mock
        mockedLocalStorageService.getItem.mockReturnValueOnce({ value: [FIRST_SEARCH, SECOND_SEARCH] });
        SearchHistoryService.updateSearchHistory(THIRD_SEARCH);
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith("search-history", [
            FIRST_SEARCH,
            SECOND_SEARCH,
            THIRD_SEARCH,
        ]);
    });

    it("should replace first search with fourth search", () => {
        const FIRST_SEARCH = { rna: RNA };
        const SECOND_SEARCH = { rna: RNA_2 };
        const THIRD_SEARCH = { rna: RNA_3 };
        const FOURTH_SEARCH = { rna: RNA_4 };
        // @ts-expect-error: mock
        mockedLocalStorageService.getItem.mockReturnValueOnce({ value: [FIRST_SEARCH, SECOND_SEARCH, THIRD_SEARCH] });
        SearchHistoryService.updateSearchHistory(FOURTH_SEARCH);
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith("search-history", [
            SECOND_SEARCH,
            THIRD_SEARCH,
            FOURTH_SEARCH,
        ]);
    });

    it.only("should update search if already in localStorage", () => {
        const FIRST_SEARCH = { rna: RNA };
        const SECOND_SEARCH = { rna: RNA_2 };
        // @ts-expect-error: mock
        mockedLocalStorageService.getItem.mockReturnValueOnce({ value: [FIRST_SEARCH, SECOND_SEARCH] });
        SearchHistoryService.updateSearchHistory({ ...FIRST_SEARCH, nbEtabs: 4 });
        expect(mockedLocalStorageService.setItem).toHaveBeenCalledWith("search-history", [
            { ...FIRST_SEARCH, nbEtabs: 4 },
            SECOND_SEARCH,
        ]);
    });
});
