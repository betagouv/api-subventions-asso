import db from "../../../../src/shared/MongoConnection";
import fs from "fs";
import path from "path";
import axios from "axios";
import sireneStockCron from "../../../../src/adapters/inputs/cron/sirene-stock.cron";

jest.mock("axios");

// import() is not tested to avoid a long process as it only calls the two other methods that are tested here
describe("Sriene stock CRON", () => {
    describe("importUnitesLegale", () => {
        const fixtureStream = fs.createReadStream(
            path.join(__dirname, "../__fixtures__", "remote.sirene-stock-unite-legale.zip"),
        );

        beforeAll(() => {
            jest.mocked(axios.request).mockResolvedValue({
                data: fixtureStream,
                status: 200,
                headers: {},
            });
        });

        it("imports data", async () => {
            // @ts-expect-error: private method
            await sireneStockCron.importUnitesLegale();
            const dbos = await db
                .collection("sirene")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            expect(dbos).toMatchSnapshot();
        });
    });

    describe("importEstablishments", () => {
        const fixtureStream = fs.createReadStream(
            path.join(__dirname, "../__fixtures__", "sirene-establishment.parquet"),
        );

        beforeAll(() => {
            jest.mocked(axios.request).mockResolvedValue({
                data: fixtureStream,
                status: 200,
                headers: {},
            });
        });

        it("imports data", async () => {
            // fixture only got lines with siren 100000000
            await db.collection("sirene").insertOne({ siren: "100000000" });
            // @ts-expect-error: private method
            await sireneStockCron.importEstablishments();
            const dbos = await db
                .collection("etablissement")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            expect(dbos).toMatchSnapshot();
        });
    });
});
