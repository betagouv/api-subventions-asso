import { LogsPort } from "./logs.port";

const mockAggregate = jest.fn(() => ({ toArray: jest.fn() }));

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        aggregate: mockAggregate,
    }),
}));

describe("Logs Port", () => {
    let port: LogsPort;

    beforeEach(() => {
        port = new LogsPort();
    });

    afterEach(() => {
        mockAggregate.mockClear();
    });

    describe("getConsumption", () => {
        it("filter last three years of logs", () => {
            jest.useFakeTimers().setSystemTime(new Date("2026-01-12"));
            const expected = new Date("2024-01-01T00:00:00.000Z");
            port.getConsumption();
            // @ts-expect-error: access aggregation $match pipeline
            const matchQuery = mockAggregate.mock.calls[0][0][0]["$match"];
            const actual = matchQuery.timestamp["$gt"];
            expect(actual).toEqual(expected);
            jest.useRealTimers();
        });
    });
});
