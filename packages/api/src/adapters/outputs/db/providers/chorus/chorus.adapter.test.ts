import MongoAdapter from "../../MongoAdapter";
import chorusAdapter from "./chorus.adapter";
import Siret from "../../../../../identifier-objects/Siret";
import { CHORUS_ENTITIES } from "../../../../../modules/providers/chorus/__fixtures__/ChorusFixtures";

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
            await chorusAdapter.upsertMany([
                { ...CHORUS_ENTITIES[0], uniqueId: "1", siret: new Siret("12345678901234") },
                { ...CHORUS_ENTITIES[1], uniqueId: "2", siret: undefined },
            ]);
            const actual = mockBulkWrite.mock.calls[0][0].map(({ updateOne }) => ({
                filter: updateOne.filter,
                siret: updateOne.update.$set.siret,
                uniqueId: updateOne.update.$set.uniqueId,
            }));
            expect(actual).toMatchInlineSnapshot(`
                [
                  {
                    "filter": {
                      "uniqueId": "1",
                    },
                    "siret": "12345678901234",
                    "uniqueId": "1",
                  },
                  {
                    "filter": {
                      "uniqueId": "2",
                    },
                    "siret": undefined,
                    "uniqueId": "2",
                  },
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
            expect(mockCursorFind).toHaveBeenCalledWith({ exercice: exerciceBudgetaire });
        });
    });
});
