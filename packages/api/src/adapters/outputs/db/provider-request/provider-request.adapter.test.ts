import providerRequestAdapter from "./provider-request.adapter";
import ProviderRequestLog from "../../../../modules/provider-request/entities/ProviderRequestLog";
import { ObjectId } from "mongodb";

describe("providerRequestPort", () => {
    it("should create a log in the database", async () => {
        const collectionMock = {
            insertOne: jest.fn().mockResolvedValue({}),
        };

        // @ts-expect-error collection is private attr
        const getCollectionMock = jest.spyOn(providerRequestAdapter, "collection", "get");
        // @ts-expect-error collectionMock type is not good
        getCollectionMock.mockReturnValue(collectionMock);

        const log = new ProviderRequestLog("TestProvider", "/test", new Date(), 200, "GET");

        await providerRequestAdapter.create(log);

        expect(collectionMock.insertOne).toHaveBeenCalledWith({
            _id: expect.any(ObjectId),
            date: expect.any(Date),
            providerId: "TestProvider",
            responseCode: 200,
            route: "/test",
            type: "GET",
        });
    });
});
