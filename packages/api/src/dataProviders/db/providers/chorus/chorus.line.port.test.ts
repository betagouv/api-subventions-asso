import chorusLinePort from "./chorus.line.port";
import MongoPort from "../../../../shared/MongoPort";
import ChorusLineEntity from "../../../../modules/providers/chorus/entities/ChorusLineEntity";

describe("chorusLinePort", () => {
    const mockBulkWrite = jest.fn();

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoPort.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({ bulkWrite: mockBulkWrite });
    });

    afterEach(() => mockBulkWrite.mockReset());

    describe("upsertMany", () => {
        it("calls bulkWrite with operations from entities", async () => {
            await chorusLinePort.upsertMany([{ uniqueId: 1 }, { uniqueId: 2 }] as unknown as ChorusLineEntity[]);
            const actual = mockBulkWrite.mock.calls[0];
            expect(actual).toMatchInlineSnapshot(`
                Array [
                  Array [
                    Object {
                      "updateOne": Object {
                        "filter": Object {
                          "uniqueId": 1,
                        },
                        "update": Object {
                          "$set": Object {
                            "uniqueId": 1,
                          },
                        },
                        "upsert": true,
                      },
                    },
                    Object {
                      "updateOne": Object {
                        "filter": Object {
                          "uniqueId": 2,
                        },
                        "update": Object {
                          "$set": Object {
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
        const mockCursorFind = jest.spyOn(chorusLinePort, "cursorFind");
        beforeEach(() => {
            mockCursorFind.mockImplementation(jest.fn());
        });
        afterAll(() => {
            mockCursorFind.mockRestore();
        });
        it("should call cursorFind with filter", () => {
            const exerciceBudgetaire = 2023;
            chorusLinePort.cursorFindOnExercise(exerciceBudgetaire);
            expect(mockCursorFind).toHaveBeenCalledWith({ "indexedInformations.exercice": exerciceBudgetaire });
        });
    });
});
