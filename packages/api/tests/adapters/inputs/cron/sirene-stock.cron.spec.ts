import db from "../../../../src/shared/MongoConnection";
import fs from "fs";
import path from "path";
import axios from "axios";
import sireneStockUniteLegaleService, {
    SireneStockUniteLegaleService,
} from "../../../../src/modules/providers/sirene/sirene-stock-unite-legale.service";
import { SireneStockCron } from "../../../../src/adapters/inputs/cron/sirene-stock.cron";
import { createEstablishmentCli } from "../../../../src/adapters/inputs/cli/establishment.cli";
import { DownloadAndImport } from "../../../../src/adapters/inputs/pipeline/import/download-and-import.pipeline";
import { sireneStockEstablishmentAdapter } from "../../../../src/adapters/outputs/api/data-gouv/data-gouv.adapter";
import DownloadFile from "../../../../src/usecases/download-file";
import { RemoveFile } from "../../../../src/usecases/remove-file";

jest.mock("axios");
// used to override test environment for the temporary folder deletion
jest.mock("../../../../src/configurations/env.conf", () => ({
    ...jest.requireActual("../../../../src/configurations/env.conf"),
    ENV: "preprod",
    PROD: false,
    DEV: false,
}));

// import() is not tested to avoid a long process as it only calls the two other methods that are tested here
describe("Sriene stock CRON", () => {
    let cron: SireneStockCron;

    beforeEach(() => {
        cron = new SireneStockCron(
            new SireneStockUniteLegaleService(),
            new DownloadAndImport(
                createEstablishmentCli(),
                new DownloadFile(sireneStockEstablishmentAdapter),
                new RemoveFile(),
            ),
        );
    });

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
            // @ts-expect-error: modify private property
            sireneStockUniteLegaleService.directory_path = "../../../../tests/adapters/inputs/__fixtures__";

            // @ts-expect-error: private method
            await cron.importUnitesLegale();
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
            await cron.importEstablishments();
            const dbos = await db
                .collection("etablissement")
                .find({}, { projection: { _id: 0 } })
                .toArray();
            expect(dbos).toMatchSnapshot();
        });
    });
});
