import MongoAdapter from "../../MongoAdapter";
import chorusAdapter from "./chorus.adapter";
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
        it("calls bulkWrite with filters from chorus unique index", async () => {
            await chorusAdapter.upsertMany(CHORUS_ENTITIES);
            const actual = mockBulkWrite.mock.calls[0][0].map(({ updateOne }) => updateOne.filter);
            expect(actual).toMatchInlineSnapshot(`
                [
                  {
                    "codeSociete": "HNOR",
                    "ej": "0001821732",
                    "exercice": 2023,
                    "numPosteDP": 3,
                    "numPosteEJ": 2,
                    "numeroDemandePaiement": "000195567",
                  },
                  {
                    "codeSociete": "HNOR",
                    "ej": "0001821732",
                    "exercice": 2023,
                    "numPosteDP": 2,
                    "numPosteEJ": 21,
                    "numeroDemandePaiement": "000212692",
                  },
                  {
                    "codeSociete": "HNOR",
                    "ej": "0003823760",
                    "exercice": 2022,
                    "numPosteDP": 2,
                    "numPosteEJ": 2,
                    "numeroDemandePaiement": "000311141",
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
