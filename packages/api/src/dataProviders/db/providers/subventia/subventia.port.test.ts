import { SubventiaDbo } from "../../../../modules/providers/subventia/@types/subventia.entity";
import subventiaPort from "./subventia.port";
describe("SubventiaPort", () => {
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
            .spyOn(subventiaPort, "collection", "get")
            //@ts-expect-error: mock
            .mockImplementation(() => collection);
    });

    afterAll(() => {
        getCollectionMock.mockReset();
    });

    describe("create", () => {
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

            await subventiaPort.create(entity);

            expect(collection.insertOne).toHaveBeenCalledWith(entity);
        });
    });

    describe("createIndexes", () => {
        it("should create indexes", () => {
            subventiaPort.createIndexes();

            expect(collection.createIndex).toHaveBeenCalledWith({ siret: 1 });
        });
    });

    describe("findAll", () => {
        it("should call find method", async () => {
            collection.find.mockImplementationOnce(() => ({
                toArray: jest.fn(),
            }));
            await subventiaPort.findAll();

            expect(collection.find).toHaveBeenCalledWith({});
        });
    });
});
