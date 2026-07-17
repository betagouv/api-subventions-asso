import MongoAdapter from "../MongoAdapter";
import sireneUniteLegaleAdapter from "./sirene-unite-legale.adapter";

describe("SireneUniteLegaleAdapter", () => {
    const mockHasNext = jest.fn();
    const mockLimit = jest.fn(() => ({ hasNext: mockHasNext }));
    const mockFind = jest.fn(() => ({ limit: mockLimit }));
    let collectionSpy: jest.SpyInstance;

    beforeAll(() => {
        collectionSpy = jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({
                find: mockFind,
            });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockHasNext.mockResolvedValue(true);
    });

    afterAll(() => {
        collectionSpy.mockRestore();
    });

    describe("collectionIsNotEmpty", () => {
        it("limits query to one document", async () => {
            await sireneUniteLegaleAdapter.collectionIsNotEmpty();
            expect(mockLimit).toHaveBeenCalledWith(1);
        });

        it("returns cursor result", async () => {
            const actual = await sireneUniteLegaleAdapter.collectionIsNotEmpty();
            expect(actual).toBe(true);
        });
    });
});
