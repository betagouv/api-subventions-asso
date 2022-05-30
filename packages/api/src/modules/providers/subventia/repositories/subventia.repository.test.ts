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

        it("should send create request to mongo", async() => {
            const expected = {
                name: "I'm subventia entity"
            } as unknown as SubventiaRequestEntity;
            
            collection.insertOne.mockImplementationOnce(() => ({ insertedId: "FAKE_ID" }));
            collection.findOne.mockImplementationOnce(() => ({ _id: "FAKE_ID", ...expected }))
            
            await subventiaRepository.create(expected);

            expect(collection.insertOne).toHaveBeenCalledWith(expected);
        })

        it("should call findOne with id return by insert", async() => {
            const expected = "FAKE_ID";
            
            collection.insertOne.mockImplementationOnce(() => ({ insertedId: expected }));
            collection.findOne.mockImplementationOnce(() => ({ _id: expected }))
            
            await subventiaRepository.create({
                name: "I'm subventia entity"
            } as unknown as SubventiaRequestEntity);

            expect(collection.findOne).toHaveBeenCalledWith({ _id: expected });
        }) 

        it("should return insered entity", async() => {
            const id = "FAKE_ID";
            const expected = { _id: id, someOtherData: true };
            
            collection.insertOne.mockImplementationOnce(() => ({ insertedId: id }));
            collection.findOne.mockImplementationOnce(() => (expected))
            
            const actual = await subventiaRepository.create({
                name: "I'm subventia entity"
            } as unknown as SubventiaRequestEntity);

            expect(actual).toEqual(expected);
        }) 
    })
})