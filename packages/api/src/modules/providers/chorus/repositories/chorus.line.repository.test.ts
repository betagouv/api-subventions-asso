import chorusLineRepository from "./chorus.line.repository";
import MongoRepository from "../../../../shared/MongoRepository";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import { ObjectId } from "mongodb";
import { update } from "lodash";
describe("ChorusLineRepository", () => {
    let mockBulkWrite = jest.fn();

    beforeAll(() => {
        jest
            // @ts-expect-error: test
            .spyOn(MongoRepository.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({ bulkWrite: mockBulkWrite });
    });

    afterEach(() => mockBulkWrite.mockReset());

    describe("upsertMany", () => {
        it("calls bulkWrite with operations from entities", async () => {
            await chorusLineRepository.upsertMany([{ uniqueId: 1 }, { uniqueId: 2 }] as unknown as ChorusLineEntity[]);
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

    describe("cursorFindIndexedData", () => {
        let mockCursorFind: jest.SpyInstance;
        beforeEach(() => {
            mockCursorFind = jest.spyOn(chorusLineRepository, "cursorFind").mockImplementation(jest.fn());
        });
        afterAll(() => {
            mockCursorFind.mockRestore();
        });
        it("should call cursorFindIndexedData without filters", () => {
            chorusLineRepository.cursorFindData();
            expect(mockCursorFind).toHaveBeenCalledWith({});
        });
        it("should call cursorFindIndexedData with filters", () => {
            const lastUpdateDate = new Date("22-02-2022");
            chorusLineRepository.cursorFindData(lastUpdateDate);
            expect(mockCursorFind).toHaveBeenCalledWith({ updated: { $gt: lastUpdateDate } });
        });
    });
});
