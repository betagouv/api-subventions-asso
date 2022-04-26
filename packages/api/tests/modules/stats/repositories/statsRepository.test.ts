import db from "../../../../src/shared/MongoConnection"
import statsRepository from "../../../../src/modules/stats/repositories/statsRepository"

const TODAY = new Date();

const dateFactory = (diff: number) => { 
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() + diff);
    return date;
};

const logs = [
    { timestamp: dateFactory(-2), meta: { req : { user: { email: "0000@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0000@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0000@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0000@test.gouv.fr" } } } },
    { timestamp: dateFactory(4), meta: { req : { user: { email: "0000@test.gouv.fr" } } } },
    { timestamp: dateFactory(-3), meta: { req : { user: { email: "0001@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0001@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0001@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0001@test.gouv.fr" } } } },
    { timestamp: dateFactory(-4), meta: { req : { user: { email: "0002@test.gouv.fr" } } } },
    { timestamp: dateFactory(-4), meta: { req : { user: { email: "0002@test.gouv.fr" } } } },
    { timestamp: dateFactory(-4), meta: { req : { user: { email: "0002@test.gouv.fr" } } } },
    { timestamp: dateFactory(-4), meta: { req : { user: { email: "0002@test.gouv.fr" } } } },
    { timestamp: dateFactory(0), meta: { req : { user: { email: "0002@test.gouv.fr" } } } },
];

describe("StatsRepository", () => {
    beforeEach(async () => {
        await db.collection('log').insertMany(logs);
    })

    describe("countUsersByRequestNbOnPeriod()", () => {
        it("return the correct number of users", async () => {
            const NB_REQUESTS = 3;
            const START = new Date(TODAY);
            START.setDate(START.getDate() + -1);
            const END = new Date(TODAY);
            END.setDate(END.getDate() + 1);
            const expected = 2;
            const actual = await statsRepository.countUsersByRequestNbOnPeriod(START, END, NB_REQUESTS);
            expect(actual).toEqual(expected);
        })
    })
})