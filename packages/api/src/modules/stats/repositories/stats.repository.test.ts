import statsRepository from "./stats.repository";
import { firstDayOfPeriod } from "../../../shared/helpers/DateHelper";

const FIRST_DAY_YEAR = firstDayOfPeriod(2022);
const YEAR = 2022;

const dateFactory = (diff: number) => {
    const date = new Date(FIRST_DAY_YEAR);
    date.setDate(FIRST_DAY_YEAR.getDate() + diff);
    return date;
};

describe("StatsRepository", () => {
    describe("countUsersByRequestNbOnPeriod()", () => {
        const NB_REQUESTS = 3;
        const START = dateFactory(-1);
        const END = dateFactory(1);

        it("should call mongo with admin filters", async () => {
            const mock = jest
                // @ts-expect-error statsRepository.collection is private attribute
                .spyOn(statsRepository.collection, "aggregate")
                // @ts-expect-error type error due to mocking documents
                .mockImplementationOnce(() => ({ next: () => ({}) }));

            await statsRepository.countUsersByRequestNbOnPeriod(START, END, NB_REQUESTS, false);

            expect(mock.mock.calls).toMatchSnapshot();
        });

        it("should call mongo without admin filters", async () => {
            const mock = jest
                // @ts-expect-error statsRepository.collection is private attribute
                .spyOn(statsRepository.collection, "aggregate")
                // @ts-expect-error type error due to mocking documents
                .mockImplementationOnce(() => ({ next: () => ({}) }));

            await statsRepository.countUsersByRequestNbOnPeriod(START, END, NB_REQUESTS, true);

            expect(mock.mock.calls).toMatchSnapshot();
        });
    });

    describe("countMedianRequestsOnPeriod()", () => {
        const START = dateFactory(-1);
        const END = dateFactory(1);

        it("should call mongo with admin filters", async () => {
            const mock = jest
                // @ts-expect-error statsRepository.collection is private attribute
                .spyOn(statsRepository.collection, "aggregate")
                // @ts-expect-error type error due to mocking documents
                .mockImplementationOnce(() => ({ toArray: () => [] }));

            await statsRepository.countMedianRequestsOnPeriod(START, END, false);

            expect(mock.mock.calls).toMatchSnapshot();
        });

        it("should call mongo without admin filters", async () => {
            const mock = jest
                // @ts-expect-error statsRepository.collection is private attribute
                .spyOn(statsRepository.collection, "aggregate")
                // @ts-expect-error type error due to mocking documents
                .mockImplementationOnce(() => ({ toArray: () => [] }));

            await statsRepository.countMedianRequestsOnPeriod(START, END, true);

            expect(mock.mock.calls).toMatchSnapshot();
        });

        it("should return median (odd)", async () => {
            // @ts-expect-error statsRepository.collection is private attribute
            jest.spyOn(statsRepository.collection, "aggregate").mockImplementationOnce(() => ({
                // @ts-expect-error type error due to mocking documents
                toArray: () => [{ nbOfRequest: 1 }, { nbOfRequest: 2 }, { nbOfRequest: 3 }],
            }));
            const expected = 2;
            const actual = await statsRepository.countMedianRequestsOnPeriod(START, END, true);

            expect(actual).toBe(expected);
        });

        it("should return median (pair)", async () => {
            // @ts-expect-error statsRepository.collection is private attribute
            jest.spyOn(statsRepository.collection, "aggregate").mockImplementationOnce(() => ({
                // @ts-expect-error type error due to mocking documents
                toArray: () => [{ nbOfRequest: 1 }, { nbOfRequest: 2 }, { nbOfRequest: 3 }, { nbOfRequest: 4 }],
            }));
            const expected = 2.5;
            const actual = await statsRepository.countMedianRequestsOnPeriod(START, END, true);

            expect(actual).toBe(expected);
        });
    });
});
