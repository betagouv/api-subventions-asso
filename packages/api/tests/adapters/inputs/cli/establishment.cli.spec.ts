import path from "path";
import EstablishmentCli from "../../../../src/adapters/inputs/cli/establishment.cli";
import db from "../../../../src/shared/MongoConnection";
import notifyService from "../../../../src/modules/notify/notify.service";
import { NotificationType } from "../../../../src/modules/notify/@types/NotificationType";
import { SireneEstablishmentDbo } from "../../../../src/adapters/outputs/db/sirene/sirene-establishment.dbo";
import importNotifier from "../../../../src/adapters/inputs/pipeline/import/import-notifier";
import sireneEstablishmentPipeline from "../../../../src/adapters/inputs/pipeline/import/sirene-establishment/sirene-establishment.pipeline";

describe("Establishment CLI", () => {
    const cli = new EstablishmentCli(sireneEstablishmentPipeline, importNotifier);

    const seedSirene = () => db.collection("sirene").insertOne({ siren: "100000000" });

    describe("parse", () => {
        beforeEach(async () => {
            await seedSirene();
        });

        it("it persist data in collection", async () => {
            await cli.parse(path.resolve(__dirname, "../__fixtures__/sirene-establishment.parquet"), "2026-07-21");

            const documents = (await db
                .collection("etablissement")
                .find({}, { projection: { _id: 0 } })
                .sort({ siret: 1 })
                .toArray()) as unknown as SireneEstablishmentDbo[];

            expect(
                documents.map(doc => ({
                    ...doc,
                    dateDernierTraitementEtablissement: expect.any(Date),
                })),
            ).toMatchSnapshot();
        });

        it("logs import in data-log", async () => {
            await cli.parse(path.resolve(__dirname, "../__fixtures__/sirene-establishment.parquet"), "2026-07-21");

            expect(await db.collection("data-log").findOne({}, { projection: { _id: 0 } })).toMatchSnapshot({
                integrationDate: expect.any(Date),
            });
        });

        it("notify results", async () => {
            const EXPORT_DATE_STR = "2026-07-21";
            const spyNotify = jest.spyOn(notifyService, "notify");

            await cli.parse(
                path.resolve(__dirname, "../__fixtures__/multiple-batch.sirene-establishment.parquet"),
                EXPORT_DATE_STR,
            );

            expect(spyNotify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_SUCCESS, {
                providerName: "SIRENE Establishment",
                exportDate: new Date(EXPORT_DATE_STR),
                details: {
                    fileName: "multiple-batch.sirene-establishment.parquet",
                    parsedCount: 5001,
                    importedCount: 5001,
                    errorCount: 0,
                    durationMs: expect.any(Number),
                    fileCount: 1,
                },
            });
        });
    });
});
