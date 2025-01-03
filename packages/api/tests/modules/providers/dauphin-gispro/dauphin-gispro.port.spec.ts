import dauphinGisproPort from "../../../../src/dataProviders/db/providers/dauphin/dauphin-gispro.port";
import DauphinGisproDbo from "../../../../src/dataProviders/db/providers/dauphin/DauphinGisproDbo";

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
            await dauphinGisproPort.upsert(DAUPHIN_GISPRO_ENTITY);
        });
        it("should return dateVersion", async () => {
            const expected = DATE;
            const actual = await dauphinGisproPort.getLastImportDate();
            expect(actual).toEqual(expected);
        });
    });
});
