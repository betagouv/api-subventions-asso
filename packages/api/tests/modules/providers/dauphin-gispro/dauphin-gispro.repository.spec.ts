import dauphinGisproRepository from "../../../../src/modules/providers/dauphin/repositories/dauphin-gispro.repository";
import DauphinGisproDbo from "../../../../src/modules/providers/dauphin/repositories/dbo/DauphinGisproDbo";

const DATE = new Date();

const DAUPHIN_GISPRO_ENTITY = {
    dauphin: {
        reference: "REF0924",
        _document: {
            dateVersion: DATE.toISOString(),
        },
    },
} as DauphinGisproDbo;

describe("DauphinGisproRepository", () => {
    describe("getLastImportDate", () => {
        beforeAll(async () => {
            await dauphinGisproRepository.upsert(DAUPHIN_GISPRO_ENTITY);
        });
        it("should return dateVersion", async () => {
            const expected = DATE;
            const actual = await dauphinGisproRepository.getLastImportDate();
            expect(actual).toEqual(expected);
        });
    });
});
