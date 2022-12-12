import statsRepository from "./statsRepository";

const FIRST_DAY_YEAR = new Date(Date.UTC(2022, 0, 1));
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
                toArray: () => [{ nbOfRequest: 1 }, { nbOfRequest: 2 }, { nbOfRequest: 3 }]
            }));
            const expected = 2;
            const actual = await statsRepository.countMedianRequestsOnPeriod(START, END, true);

            expect(actual).toBe(expected);
        });

        it("should return median (pair)", async () => {
            // @ts-expect-error statsRepository.collection is private attribute
            jest.spyOn(statsRepository.collection, "aggregate").mockImplementationOnce(() => ({
                // @ts-expect-error type error due to mocking documents
                toArray: () => [{ nbOfRequest: 1 }, { nbOfRequest: 2 }, { nbOfRequest: 3 }, { nbOfRequest: 4 }]
            }));
            const expected = 2.5;
            const actual = await statsRepository.countMedianRequestsOnPeriod(START, END, true);

            expect(actual).toBe(expected);
        });
    });

    describe("countRequestsPerMonthByYear()", () => {
        async function checkMonthlyAvgStatFormat(aggregateOutput, expected) {
            // @ts-expect-error statsRepository.collection is private attribute and mock typing errors
            jest.spyOn(statsRepository.collection, "aggregate").mockReturnValueOnce({ toArray: () => aggregateOutput });
            const actual = await statsRepository.countRequestsPerMonthByYear(YEAR, false);
            expect(actual).toStrictEqual(expected);
        }

        it("should format the result properly", async () => {
            await checkMonthlyAvgStatFormat(
                [
                    { _id: 1, nbOfRequests: 201 },
                    { _id: 2, nbOfRequests: 21 },
                    { _id: 3, nbOfRequests: 20 },
                    { _id: 4, nbOfRequests: 201 },
                    { _id: 5, nbOfRequests: 13 },
                    { _id: 6, nbOfRequests: 201 },
                    { _id: 7, nbOfRequests: 201 },
                    { _id: 8, nbOfRequests: 15 },
                    { _id: 9, nbOfRequests: 201 },
                    { _id: 10, nbOfRequests: 300 },
                    { _id: 11, nbOfRequests: 201 },
                    { _id: 12, nbOfRequests: 1 }
                ],
                {
                    January: 201,
                    February: 21,
                    March: 20,
                    April: 201,
                    May: 13,
                    June: 201,
                    July: 201,
                    August: 15,
                    September: 201,
                    October: 300,
                    November: 201,
                    December: 1
                }
            );
        });

        it("should fill in empty months", async () => {
            await checkMonthlyAvgStatFormat(
                [
                    { _id: 1, nbOfRequests: 201 },
                    { _id: 2, nbOfRequests: 21 },
                    { _id: 10, nbOfRequests: 300 },
                    { _id: 12, nbOfRequests: 1 }
                ],
                {
                    January: 201,
                    February: 21,
                    March: 0,
                    April: 0,
                    May: 0,
                    June: 0,
                    July: 0,
                    August: 0,
                    September: 0,
                    October: 300,
                    November: 0,
                    December: 1
                }
            );
        });
    });
});
