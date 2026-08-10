import path from "path";
import { RnaCli } from "../../../../src/adapters/inputs/cli/rna.cli";
import rnaPipeline from "../../../../src/adapters/inputs/pipeline/import/rna/rna.pipeline";
import db from "./../../../../src/shared/MongoConnection";
import notifyService from "../../../../src/modules/notify/notify.service";
import { NotificationType } from "../../../../src/modules/notify/@types/NotificationType";
import RnaDbo from "../../../../src/adapters/outputs/db/rna/rna.dbo";
import { DataLogSource } from "../../../../src/modules/data-log/entities/dataLogEntity";

describe("RNA CLI", () => {
    const cli = new RnaCli(rnaPipeline);

    describe("parse", () => {
        const EXPORT_DATE_STR = "2026-07-17";
        it("it persist data in collection", async () => {
            await cli.parse(
                path.resolve(__dirname, "../__fixtures__/multiple-batch.rna-waldec.parquet"),
                EXPORT_DATE_STR,
            );

            // sample only 5 documents to snapshot
            const documents = (await db
                .collection("rna")
                .find({}, { limit: 5, projection: { _id: 0 } })
                .toArray()) as unknown as RnaDbo[];
            expect(documents.map(doc => ({ ...doc, "maj-time": expect.any(Date) }))).toMatchSnapshot();
        });

        it("logs import in data-log", async () => {
            await cli.parse(
                path.resolve(__dirname, "../__fixtures__/multiple-batch.rna-waldec.parquet"),
                EXPORT_DATE_STR,
            );
            expect(await db.collection("data-log").findOne({}, { projection: { _id: 0 } })).toMatchSnapshot({
                integrationDate: expect.any(Date),
            });
        });

        it("notify results", async () => {
            const spyNotify = jest.spyOn(notifyService, "notify");
            await cli.parse(
                path.resolve(__dirname, "../__fixtures__/multiple-batch.rna-waldec.parquet"),
                EXPORT_DATE_STR,
            );
            expect(spyNotify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_SUCCESS, {
                providerName: "RNA",
                exportDate: new Date(EXPORT_DATE_STR),
                details: {
                    fileName: "multiple-batch.rna-waldec.parquet",
                    parsedCount: 5001,
                    importedCount: 5001,
                    errorCount: 0,
                    durationMs: expect.any(Number),
                    fileCount: 1,
                },
            });
        });

        it("only imports updated rows", async () => {
            const LAST_IMPORT_DATE = new Date("2026-01-01");
            await db.collection("data-log").insertOne({
                providerId: "rna",
                providerName: "RNA",
                source: DataLogSource.FILE,
                fileName: "first-import.parquet",
                integrationDate: LAST_IMPORT_DATE,
            });

            const FILE_PATH = path.resolve(__dirname, "../__fixtures__/diff-maj-time.rna-waldec.parquet");
            await cli.parse(FILE_PATH, EXPORT_DATE_STR);

            // sample only 5 documents to snapshot
            const documents = (await db
                .collection("rna")
                .find({}, { projection: { _id: 0 } })
                .toArray()) as unknown as RnaDbo[];

            expect(documents).toMatchSnapshot();
        });
    });
});
