import { SubventiaDbo } from "../@types/subventia.entity";
import subventiaRepository from "./subventia.repository";

describe("SubventiaRepository", () => {
    describe("create", () => {
        let getCollectionMock: jest.SpyInstance;
        const collection = {
            insertOne: jest.fn(),
            findOne: jest.fn(),
        };

        beforeAll(() => {
            getCollectionMock = jest
                //@ts-expect-error Use for mock collection (private attribute)
                .spyOn(subventiaRepository, "collection", "get")
                //@ts-expect-error: mock
                .mockImplementation(() => collection);
        });

        beforeEach(() => {
            collection.insertOne.mockClear();
            collection.findOne.mockClear();
        });

        afterEach(() => {
            getCollectionMock.mockClear();
        });

        it("should send create request to mongo", async () => {
            const entity = {
                name: "I'm subventia entity",
            } as unknown as Omit<SubventiaDbo, "_id">;

            collection.insertOne.mockImplementationOnce(() => ({
                insertedId: "FAKE_ID",
            }));
            collection.findOne.mockImplementationOnce(() => ({
                _id: "FAKE_ID",
                ...entity,
            }));

            await subventiaRepository.create(entity);

            expect(collection.insertOne).toHaveBeenCalledWith(entity);
        });
    });
});
