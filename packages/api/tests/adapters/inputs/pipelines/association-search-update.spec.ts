import path from "path";
import fs from "fs";
import rnaCli from "../../../../src/adapters/inputs/cli/rna.cli";
import SireneStockUniteLegaleCli from "../../../../src/adapters/inputs/cli/sirene-stock-unite-legale.cli";
import db from "../../../../src/shared/MongoConnection";
import { sireneStockUniteLegaleAdapter } from "../../../../src/adapters/outputs/api/data-gouv/data-gouv.adapter";
import { createEstablishmentCli } from "../../../../src/adapters/inputs/cli/establishment.cli";
import { useOnlyFakeDate } from "../../../__helpers__/fake-date";
import sireneUniteLegalePipeline from "../../../../src/adapters/inputs/pipeline/import/sirene-unite-legale/sirene-unite-legale.pipeline";
import DownloadFile from "../../../../src/usecases/download-file";
import { RemoveFile } from "../../../../src/usecases/remove-file";
import dataLogAdapter from "../../../../src/adapters/outputs/db/data-log/data-log.adapter";
import { DataLogSource } from "../../../../src/modules/data-log/entities/dataLogEntity";

async function mockUniteLegaleImport(date = "2024-12-01") {
    const sireneImportDate = new Date(date);

    // make it possible to insert rna without inserting sirene unite legale first
    // only to make the test easier to read
    await dataLogAdapter.insert({
        source: DataLogSource.FILE,
        providerId: "sirene-unite-legale",
        integrationDate: sireneImportDate,
        fileName: "latest-unite-legale",
    });
}

async function importLatestRna() {
    await rnaCli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec/latest-rna-waldec.parquet"), "2025-12-01");
}

async function importOldRna() {
    await rnaCli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec/old-rna-waldec.parquet"), "2024-12-01");
}

// simulate two imports (mimics the one month cron)
async function importManyRna() {
    await mockUniteLegaleImport();

    useOnlyFakeDate();
    try {
        jest.setSystemTime(new Date("2024-12-03")); // mock first import in 2024
        await importOldRna();
        jest.useRealTimers();
        await importLatestRna(); // should add new lines from 2025
    } catch (e) {
        console.log(e);
        jest.useRealTimers();
    }
}

async function importLatestUniteLegale() {
    jest.spyOn(sireneStockUniteLegaleAdapter, "getFileStream").mockImplementation(() =>
        Promise.resolve({
            data: fs.createReadStream(
                path.resolve(__dirname, "./../__fixtures__/unite-legale") + "/latest-unite-legale.parquet",
            ),
            status: 200,
            statusText: "OK",
        }),
    );

    return new SireneStockUniteLegaleCli(
        sireneUniteLegalePipeline,
        new DownloadFile(sireneStockUniteLegaleAdapter),
        new RemoveFile(),
    ).import();
}

async function importOldUniteLegale() {
    jest.spyOn(sireneStockUniteLegaleAdapter, "getFileStream").mockImplementation(() =>
        Promise.resolve({
            data: fs.createReadStream(
                path.resolve(__dirname, "./../__fixtures__/unite-legale") + "/old-unite-legale.parquet",
            ),
            status: 200,
            statusText: "OK",
        }),
    );

    return new SireneStockUniteLegaleCli(
        sireneUniteLegalePipeline,
        new DownloadFile(sireneStockUniteLegaleAdapter),
        new RemoveFile(),
    ).import();
}

// simulate two imports (mimics the one month cron)
async function importManyUniteLegale() {
    useOnlyFakeDate();
    try {
        jest.setSystemTime(new Date("2024-12-02")); // mock first import in 2024
        await importOldUniteLegale();
        jest.useRealTimers();
        await importLatestUniteLegale(); // should add new lines from 2025
    } catch (e) {
        console.log(e);
        jest.useRealTimers();
    }
}

async function importEstablishment() {
    await createEstablishmentCli().parse(
        path.resolve(__dirname, "../__fixtures__/sirene-establishment.parquet"),
        "2026-07-21",
    );
}

// simulate the normal process, with one of each data set persisted in order
async function importAll() {
    await importLatestUniteLegale();
    await importEstablishment();
    await importLatestRna();
}

// @TODO: make siren in both unite legale and rna parquet file linked to fully test this
describe("association search pipeline", () => {
    it("should be the merge of unite legale and rna", async () => {
        await importAll();
        await expect(
            await db
                .collection("association-search")
                .find({}, { projection: { _id: 0 } })
                .toArray(),
        ).toMatchSnapshot(); // nothing relevant to siren 100000001 should be stored as it is no an association (legal category from unite legale)
    });

    describe("focus on sirene unité légale", () => {
        it("updates documents after a second import", async () => {
            await importManyUniteLegale();
            await expect(
                await db
                    .collection("association-search")
                    .find({}, { projection: { _id: 0 } })
                    .toArray(),
            ).toMatchSnapshot(); // no orphan should be found as the latest file has only lines with rna defined
        });
    });

    describe("focus on rna", () => {
        it("updates documents after a second import", async () => {
            await importManyRna();
            await expect(
                await db
                    .collection("association-search")
                    .find({}, { projection: { _id: 0 } })
                    .toArray(),
            ).toMatchSnapshot(); // no orphan should be found as the latest file has only lines with rna defined
        });

        it("save siret as siren when present", async () => {
            await mockUniteLegaleImport();
            await importLatestRna();
            await expect(
                await db
                    .collection("association-search")
                    .find({ rna: "W000000004" }, { projection: { _id: 0 } })
                    .toArray(),
            ).toMatchSnapshot();
        });
    });
});
