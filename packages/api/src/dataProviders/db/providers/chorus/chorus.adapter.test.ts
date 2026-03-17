import MongoAdapter from "../../MongoAdapter";
import chorusAdapter from "./chorus.adapter";
import ChorusEntity from "../../../../modules/providers/chorus/entities/ChorusEntity";

describe("chorusPort", () => {
    const mockBulkWrite = jest.fn();

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoAdapter.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({ bulkWrite: mockBulkWrite });
    });

    afterEach(() => mockBulkWrite.mockReset());

    describe("upsertMany", () => {
        it("calls bulkWrite with operations from entities", async () => {
            await chorusAdapter.upsertMany([{ uniqueId: 1 }, { uniqueId: 2 }] as unknown as ChorusEntity[]);
            const actual = mockBulkWrite.mock.calls[0];
            expect(actual).toMatchInlineSnapshot(`
                [
                  [
                    {
                      "updateOne": {
                        "filter": {
                          "uniqueId": 1,
                        },
                        "update": {
                          "$set": {
                            "uniqueId": 1,
                          },
                        },
                        "upsert": true,
                      },
                    },
                    {
                      "updateOne": {
                        "filter": {
                          "uniqueId": 2,
                        },
                        "update": {
                          "$set": {
                            "uniqueId": 2,
                          },
                        },
                        "upsert": true,
                      },
                    },
                  ],
                ]
            `);
        });
    });

    describe("cursorFindOnExercise", () => {
        const mockCursorFind = jest.spyOn(chorusAdapter, "cursorFind");
        beforeEach(() => {
            mockCursorFind.mockImplementation(jest.fn());
        });
        afterAll(() => {
            mockCursorFind.mockRestore();
        });
        it("should call cursorFind with filter", () => {
            const exerciceBudgetaire = 2023;
            chorusAdapter.cursorFindOnExercise(exerciceBudgetaire);
            expect(mockCursorFind).toHaveBeenCalledWith({ "indexedInformations.exercice": exerciceBudgetaire });
        });
    });
});
