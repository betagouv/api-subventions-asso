import { CONSUMER_USER } from "../../../modules/user/__fixtures__/user.fixture";
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
            const expected = new Date("2025");
            port.getConsumption();
            // @ts-expect-error: access aggregation $match pipeline
            const matchQuery = mockAggregate.mock.calls[0][0][0]["$match"];
            const actual = matchQuery.timestamp["$gte"];
            expect(actual).toEqual(expected);
            jest.useRealTimers();
        });

        it.each([{ userIds: [CONSUMER_USER._id.toString()] }, { userIds: [] }])(
            "match given users id",
            ({ userIds }) => {
                const expected = { $in: userIds };
                port.getConsumption(userIds);
                // @ts-expect-error: access aggregation $match pipeline
                const matchQuery = mockAggregate.mock.calls[0][0][0]["$match"];
                const actual = matchQuery["meta.req.user._id"];
                expect(actual).toEqual(expected);
            },
        );
    });
});
