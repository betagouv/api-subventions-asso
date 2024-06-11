import { SubventiaDbo } from "../@types/subventia.entity";
import subventiaRepository from "./subventia.repository";
describe("SubventiaRepository", () => {
    let getCollectionMock: jest.SpyInstance;

    let collection = {
        insertOne: jest.fn(),
        findOne: jest.fn(),
        createIndex: jest.fn(),
        find: jest.fn(),
    };

    beforeAll(() => {
        getCollectionMock = jest
            //@ts-expect-error Use for mock collection (private attribute)
            .spyOn(subventiaRepository, "collection", "get")
            //@ts-expect-error: mock
            .mockImplementation(() => collection);
    });

    afterAll(() => {
        getCollectionMock.mockReset();
    });

    describe("create", () => {
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

    describe("createIndexes", () => {
        it("should create indexes", () => {
            subventiaRepository.createIndexes();

            expect(collection.createIndex).toHaveBeenCalledWith({ siret: 1 });
        });
    });

    describe("findAll", () => {
        it("should call find method", async () => {
            collection.find.mockImplementationOnce(() => ({
                toArray: jest.fn(),
            }));
            await subventiaRepository.findAll();

            expect(collection.find).toHaveBeenCalledWith({});
        });
    });
});
