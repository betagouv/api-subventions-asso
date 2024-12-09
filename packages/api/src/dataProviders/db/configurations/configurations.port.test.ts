import configurationsPort from "../../../dataProviders/db/configurations/configurations.port";

describe("Configuration Port", () => {
    // @ts-expect-error collection is private methods for getter
    const collectionMock: jest.SpyInstance<unknown> = jest.spyOn(configurationsPort, "collection", "get");

    describe("upsert", () => {
        it("should be call updateOne of collection", async () => {
            const fn = jest.fn();
            collectionMock.mockImplementationOnce(() => ({ updateOne: fn }));

            const expected = [
                {
                    name: "TEST",
                },
                {
                    $set: expect.objectContaining({ data: "test-data", name: "TEST" }),
                },
                {
                    upsert: true,
                },
            ];

            configurationsPort.upsert("TEST", {
                data: "test-data",
                name: "TEST",
            });

            expect(fn).toHaveBeenCalledWith(...expected);
        });
    });

    describe("getByName", () => {
        it("should be call findOne of collection", async () => {
            const fn = jest.fn();
            collectionMock.mockImplementationOnce(() => ({ findOne: fn }));

            const expected = [
                {
                    name: "TEST",
                },
            ];

            configurationsPort.getByName("TEST");

            expect(fn).toHaveBeenCalledWith(...expected);
        });
    });
});
