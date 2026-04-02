import { CHORUS_FSE_ENTITIES } from "../../../../../modules/providers/chorus/__fixtures__/ChorusFixtures";
import MongoAdapter from "../../MongoAdapter";
import chorusFseAdapter from "./chorus.fse.adapter";

describe("ChorusFsePort", () => {
    const cursor = CHORUS_FSE_ENTITIES;

    let mockToEntity;

    const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(CHORUS_FSE_ENTITIES),
    });

    beforeAll(() => {
        // @ts-expect-error: mock private method
        mockToEntity = jest.spyOn(chorusFseAdapter, "toEntity").mockImplementation(dbo => dbo);
        // @ts-expect-error: mock toArray
        cursor.toArray = async () => CHORUS_FSE_ENTITIES;
        // @ts-expect-error: mock MongoAdapter class
        jest.spyOn(MongoAdapter.prototype, "collection", "get").mockReturnValue({ find: mockFind });
    });

    describe("findByExercise", () => {
        const EXERCISE = 2026;
        it("query collection by exercise", async () => {
            await chorusFseAdapter.findByExercise(EXERCISE);
            expect(mockFind).toHaveBeenCalledWith({ budgetaryYear: EXERCISE });
        });

        it("maps dto to entity", async () => {
            await chorusFseAdapter.findByExercise(EXERCISE);
            expect(mockToEntity).toHaveBeenCalled();
        });
    });
});
