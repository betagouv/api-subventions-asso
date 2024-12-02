import statsPort, { StatsPort } from "../../../dataProviders/db/stats/stats.port";
import { firstDayOfPeriod } from "../../../shared/helpers/DateHelper";
import MongoRepository from "../../../shared/MongoRepository";

const FIRST_DAY_YEAR = firstDayOfPeriod(2022);
const YEAR = 2022;

const dateFactory = (diff: number) => {
    const date = new Date(FIRST_DAY_YEAR);
    date.setDate(FIRST_DAY_YEAR.getDate() + diff);
    return date;
};

describe("StatsPort", () => {
    const mockToArray = jest.fn();
    let spyAggregate = jest.fn(() => ({ toArray: mockToArray }));
    let mockMongoRepositoryCollection: jest.SpyInstance;
    beforeAll(() => {
        mockMongoRepositoryCollection = jest
            // @ts-expect-error: test
            .spyOn(MongoRepository.prototype, "collection", "get")
            // @ts-expect-error: test
            .mockReturnValue({ aggregate: spyAggregate });
    });

    afterAll(() => mockMongoRepositoryCollection.mockRestore());

    describe("countMedianRequestsOnPeriod()", () => {
        const START = dateFactory(-1);
        const END = dateFactory(1);

        it("should call mongo with admin filters", async () => {
            mockToArray.mockReturnValueOnce([]);
            await statsPort.countMedianRequestsOnPeriod(START, END, false);

            expect(spyAggregate.mock.calls).toMatchSnapshot();
        });

        it("should call mongo without admin filters", async () => {
            mockToArray.mockReturnValueOnce([]);
            await statsPort.countMedianRequestsOnPeriod(START, END, true);

            expect(spyAggregate.mock.calls).toMatchSnapshot();
        });

        it("should return median (odd)", async () => {
            mockToArray.mockReturnValueOnce([{ nbOfRequest: 1 }, { nbOfRequest: 2 }, { nbOfRequest: 3 }]);
            const expected = 2;
            const actual = await statsPort.countMedianRequestsOnPeriod(START, END, true);

            expect(actual).toBe(expected);
        });

        it("should return median (pair)", async () => {
            mockToArray.mockReturnValueOnce([
                { nbOfRequest: 1 },
                { nbOfRequest: 2 },
                { nbOfRequest: 3 },
                { nbOfRequest: 4 },
            ]);
            const expected = 2.5;
            const actual = await statsPort.countMedianRequestsOnPeriod(START, END, true);

            expect(actual).toBe(expected);
        });
    });

    describe("countRequestsPerMonthByYear()", () => {
        const MONGO_OUTPUT = [
            { _id: 1, nbOfRequest: 201 },
            { _id: 2, nbOfRequest: 21 },
            { _id: 10, nbOfRequest: 300 },
            { _id: 12, nbOfRequest: 1 },
        ];
        beforeAll(() => mockToArray.mockResolvedValueOnce(MONGO_OUTPUT));

        it("calls mongo aggregation", async () => {
            await statsPort.countRequestsPerMonthByYear(YEAR, false);
            expect(spyAggregate).toBeCalled();
        });

        it("returns port's result'", async () => {
            mockToArray.mockReturnValueOnce(MONGO_OUTPUT);
            const expected = MONGO_OUTPUT;
            const actual = await statsPort.countRequestsPerMonthByYear(YEAR, false);
            expect(actual).toStrictEqual(expected);
        });
    });
});
