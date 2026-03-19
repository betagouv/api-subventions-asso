import chorusLineAdapter from "./chorus.line.adapter";
import MongoAdapter from "../../MongoAdapter";
import ChorusLineEntity from "../../../../modules/providers/chorus/entities/ChorusLineEntity";

describe("chorusLinePort", () => {
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
            await chorusLineAdapter.upsertMany([{ uniqueId: 1 }, { uniqueId: 2 }] as unknown as ChorusLineEntity[]);
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
        const mockCursorFind = jest.spyOn(chorusLineAdapter, "cursorFind");
        beforeEach(() => {
            mockCursorFind.mockImplementation(jest.fn());
        });
        afterAll(() => {
            mockCursorFind.mockRestore();
        });
        it("should call cursorFind with filter", () => {
            const exerciceBudgetaire = 2023;
            chorusLineAdapter.cursorFindOnExercise(exerciceBudgetaire);
            expect(mockCursorFind).toHaveBeenCalledWith({ "indexedInformations.exercice": exerciceBudgetaire });
        });
    });
});
