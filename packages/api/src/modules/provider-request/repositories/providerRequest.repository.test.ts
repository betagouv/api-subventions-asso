import providerRequestRepository from "./providerRequest.repository";
import ProviderRequestLog from "../entities/ProviderRequestLog";
import ProviderRequestLogAdapter from "./adapters/ProviderRequestLogAdapter";

jest.mock("mongodb"); // Mock mongodb if needed
jest.mock("./adapters/ProviderRequestLogAdapter"); // Mock ProviderRequestLogAdapter

describe("providerRequestRepository", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a log in the database", async () => {
        // Mock ProviderRequestLogAdapter to return a Dbo
        const createLogDboMock = ProviderRequestLogAdapter.formDomain as jest.Mock;
        createLogDboMock.mockReturnValue({
            /* Dbo mock here */
        });

        const collectionMock = {
            insertOne: jest.fn().mockResolvedValue({
                /* Insert result mock here */
            }),
        };

        // Mock the getter for collection
        // @ts-expect-error collection is private attr
        const getCollectionMock = jest.spyOn(providerRequestRepository, "collection", "get");
        // @ts-expect-error collectionMock type is not good
        getCollectionMock.mockReturnValue(collectionMock);

        // Generate fake data for a valid ProviderRequestLog
        const log = new ProviderRequestLog(
            "TestProvider",
            "/test",
            new Date(),
            200,
            "GET",
            "fake_id", // Replace with a valid ID value
        );

        await providerRequestRepository.create(log);

        // Verify that the insertOne method is called with the correct Dbo
        expect(collectionMock.insertOne).toHaveBeenCalledWith(createLogDboMock(log));

        // You can also add additional assertions as needed
    });
});
