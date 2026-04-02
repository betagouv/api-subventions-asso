import dauphinAdapter from "../../../../src/adapters/outputs/db/providers/dauphin/dauphin.adapter";
import DauphinGisproDbo from "../../../../src/adapters/outputs/db/providers/dauphin/DauphinGisproDbo";

const DATE = new Date();

const DAUPHIN_GISPRO_ENTITY = {
    dauphin: {
        reference: "REF0924",
        _document: {
            dateVersion: DATE.toISOString(),
        },
    },
} as DauphinGisproDbo;

describe("DauphinGisproPort", () => {
    describe("getLastImportDate", () => {
        beforeAll(async () => {
            await dauphinAdapter.upsert(DAUPHIN_GISPRO_ENTITY);
        });
        it("should return dateVersion", async () => {
            const expected = DATE;
            const actual = await dauphinAdapter.getLastImportDate();
            expect(actual).toEqual(expected);
        });
    });
});
