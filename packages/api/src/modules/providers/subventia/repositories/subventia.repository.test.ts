import { SubventiaRequestEntity } from "../entities/SubventiaRequestEntity"
import subventiaRepository from "./subventia.repository"

describe('SubventiaRepository', () => {
    describe("create", () => {
        let getCollectionMock: jest.SpyInstance;
        const collection = {
            insertOne: jest.fn(),
            findOne: jest.fn(),
        }

        beforeAll(() => {
            //@ts-expect-error Use for mock collection (private attribute)
            getCollectionMock = jest.spyOn(subventiaRepository, "collection", "get").mockImplementation(() => collection)
        });

        beforeEach(() => {
            collection.insertOne.mockClear();
            collection.findOne.mockClear();
        });

        afterEach(() => {
            getCollectionMock.mockClear()
        })

        it("should send create request to mongo", async () => {
            const expected = {
                name: "I'm subventia entity"
            } as unknown as SubventiaRequestEntity;

            collection.insertOne.mockImplementationOnce(() => ({ insertedId: "FAKE_ID" }));
            collection.findOne.mockImplementationOnce(() => ({ _id: "FAKE_ID", ...expected }))

            await subventiaRepository.create(expected);

            expect(collection.insertOne).toHaveBeenCalledWith(expected);
        })
    })
})