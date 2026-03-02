import { CHORUS_FSE_ENTITIES } from "../../../../modules/providers/chorus/__fixtures__/ChorusFixtures";
import MongoPort from "../../../../shared/MongoPort";
import chorusFsePort from "./chorus.fse.port";

describe("ChorusFsePort", () => {
    const cursor = CHORUS_FSE_ENTITIES;

    let mockToEntity;

    const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(CHORUS_FSE_ENTITIES),
    });

    beforeAll(() => {
        // @ts-expect-error: mock private method
        mockToEntity = jest.spyOn(chorusFsePort, "toEntity").mockImplementation(dbo => dbo);
        // @ts-expect-error: mock toArray
        cursor.toArray = async () => CHORUS_FSE_ENTITIES;
        // @ts-expect-error: mock MongoPort class
        jest.spyOn(MongoPort.prototype, "collection", "get").mockReturnValue({ find: mockFind });
    });

    describe("findAll", () => {
        it("maps dto to entity", async () => {
            await chorusFsePort.findAll();
            expect(mockToEntity).toHaveBeenCalled();
        });
    });
});
