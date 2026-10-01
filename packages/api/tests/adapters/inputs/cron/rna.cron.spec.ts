import rnaCron from "../../../../src/adapters/inputs/cron/rna.cron";
import db from "../../../../src/shared/MongoConnection";
import fs from "fs";
import path from "path";
import axios from "axios";
import dataLogAdapter from "../../../../src/adapters/outputs/db/data-log/data-log.adapter";
import { DataLogSource } from "../../../../src/modules/data-log/entities/dataLogEntity";
import { addMonths } from "../../../../src/shared/helpers/DateHelper";

jest.mock("axios");

describe("RNA CRON", () => {
    const fixtureStream = fs.createReadStream(
        path.join(__dirname, "../__fixtures__", "multiple-batch.rna-waldec.parquet"),
    );

    beforeEach(() => {
        jest.mocked(axios.request).mockResolvedValue({
            data: fixtureStream,
            status: 200,
            headers: {},
        });
    });

    describe("import", () => {
        it("import RNA", async () => {
            await dataLogAdapter.insert({
                providerId: "sirene-unite-legale",
                providerName: "SIRENE Unité Légale",
                fileName: "stock-stockunitelegale-parquet.parquet",
                source: DataLogSource.FILE,
                integrationDate: addMonths(new Date(), -1),
            });

            await rnaCron.import();
            const dbos = await db
                .collection("rna")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            // snapshot a sample to avoid storing the 5001 documents
            // only take the first lines and the last one to ensure the process did more than one batch
            const sample = [...dbos.slice(0, 5), dbos.at(-1)];
            expect(sample.map(dbo => ({ ...dbo, "maj-time": expect.any(Date) }))).toMatchSnapshot();
        });
    });
});
