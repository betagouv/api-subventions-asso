import statsRepository from "./statsRepository"

const TODAY = new Date(Date.UTC(2022,0,1));

const dateFactory = (diff: number) => { 
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() + diff);
    return date;
};

describe("StatsRepository", () => {
    describe("countUsersByRequestNbOnPeriod()", () => {
        const NB_REQUESTS = 3;
        const START = dateFactory(-1);
        const END = dateFactory(1);

        it('should call mongo with admin filters', async () => {
            // @ts-expect-error statsRepository.collection is private attribute
            const mock = jest.spyOn(statsRepository.collection, "aggregate").mockImplementationOnce(() => ({next: () => ({})}));

            await statsRepository.countUsersByRequestNbOnPeriod(START, END, NB_REQUESTS, false);
            
            expect(mock.mock.calls).toMatchSnapshot()
        })

        it('should call mongo without admin filters', async () => {
            // @ts-expect-error statsRepository.collection is private attribute
            const mock = jest.spyOn(statsRepository.collection, "aggregate").mockImplementationOnce(() => ({next: () => ({})}));

            await statsRepository.countUsersByRequestNbOnPeriod(START, END, NB_REQUESTS, true);
            
            expect(mock.mock.calls).toMatchSnapshot()
        })
    })
})