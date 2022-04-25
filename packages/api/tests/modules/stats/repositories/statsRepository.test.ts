import db from "../../../../src/shared/MongoConnection"
import statsRepository from "../../../../src/modules/stats/repositories/statsRepository"
import { formatTimestamp, getYMDFromISO } from '../../../../src/shared/helpers/DateHelper';

const TODAY = new Date();

const isoDateFactory = (diff: number) => { 
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() + diff);
    return formatTimestamp(date.toISOString());
};

const logs = [
    { timestamp: isoDateFactory(-2), meta: { user: { email: "0000@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0000@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0000@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0000@test.gouv.fr" } } },
    { timestamp: isoDateFactory(4), meta: { user: { email: "0000@test.gouv.fr" } } },
    { timestamp: isoDateFactory(-3), meta: { user: { email: "0001@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0001@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0001@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0001@test.gouv.fr" } } },
    { timestamp: isoDateFactory(-4), meta: { user: { email: "0002@test.gouv.fr" } } },
    { timestamp: isoDateFactory(-4), meta: { user: { email: "0002@test.gouv.fr" } } },
    { timestamp: isoDateFactory(-4), meta: { user: { email: "0002@test.gouv.fr" } } },
    { timestamp: isoDateFactory(-4), meta: { user: { email: "0002@test.gouv.fr" } } },
    { timestamp: isoDateFactory(0), meta: { user: { email: "0002@test.gouv.fr" } } },
];

describe("StatsRepository", () => {
    beforeAll(async () => {
        await db.collection('log').insertMany(logs);
    })

    describe("countUsersByRequestNbOnPeriod()", () => {
        it("return the correct number of users", async () => {
            const NB_REQUESTS = "3";
            const START_PERIOD = new Date(TODAY);
            START_PERIOD.setDate(START_PERIOD.getDate() + -1);
            const START = getYMDFromISO(formatTimestamp(START_PERIOD.toISOString()));
            const END_PERIOD = new Date(TODAY);
            END_PERIOD.setDate(END_PERIOD.getDate() + 1);
            const END = getYMDFromISO(formatTimestamp(END_PERIOD.toISOString()));
            const expected = 2;
            const actual = await statsRepository.countUsersByRequestNbOnPeriod(START, END, NB_REQUESTS);
            console.log({actual});
            expect(actual).toEqual(expected);
        })
    })
})