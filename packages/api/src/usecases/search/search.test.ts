import { Search } from "./search";

describe("Search Use Case", () => {
    const SEARCH_INPUT = {
        value: "Tennis",
        page: "1",
    };
    const useCase = new Search();
    it("returns paginated result", async () => {
        const expected = {
            results: [],
            nbPages: 1,
            page: 1,
            total: 3,
        };
        const actual = await useCase.execute(SEARCH_INPUT);
        expect(actual).toEqual(expected);
    });
});
