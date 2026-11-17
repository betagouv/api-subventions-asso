import MongoAdapter from "../../MongoAdapter";
import chorusAdapter from "./chorus.adapter";
import { CHORUS_DBOS } from "./chorus.fixtures";

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
            await chorusAdapter.upsertMany(CHORUS_DBOS);
            const actual = mockBulkWrite.mock.calls[0][0].map(({ updateOne }) => updateOne.filter);
            expect(actual).toMatchSnapshot();
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
