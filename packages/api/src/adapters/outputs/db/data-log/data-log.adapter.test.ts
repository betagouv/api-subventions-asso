import MongoAdapter from "../MongoAdapter";
import dataLogAdapter from "./data-log.adapter";

describe("DataLogAdapter", () => {
    const mockFindOne = jest.fn();

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({ findOne: mockFindOne });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getLastEditionDateByProvider", () => {
        it("queries latest edition date by provider", async () => {
            await dataLogAdapter.getLastEditionDateByProvider("provider");
            expect(mockFindOne).toHaveBeenCalledWith(
                { providerId: "provider", editionDate: { $exists: true } },
                { sort: { editionDate: -1 }, projection: { editionDate: 1 } },
            );
        });

        it("returns null when no log exists", async () => {
            mockFindOne.mockResolvedValueOnce(null);
            const actual = await dataLogAdapter.getLastEditionDateByProvider("provider");
            expect(actual).toBeNull();
        });
    });
});
