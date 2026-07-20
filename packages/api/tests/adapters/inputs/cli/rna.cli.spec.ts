import path from "path";
import { RnaCli } from "../../../../src/adapters/inputs/cli/rna.cli";
import rnaPipeline from "../../../../src/adapters/inputs/pipeline/import/rna/rna.pipeline";
import db from "./../../../../src/shared/MongoConnection";
import notifyService from "../../../../src/modules/notify/notify.service";
import { NotificationType } from "../../../../src/modules/notify/@types/NotificationType";
import RnaDbo from "../../../../src/adapters/outputs/db/rna/rna.dbo";

describe("RNA CLI", () => {
    const cli = new RnaCli(rnaPipeline);

    describe("parse", () => {
        it("it persist data in collection", async () => {
            await cli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec.parquet"), "2026-07-17");

            // sample only 5 documents to snapshot
            const documents = (await db
                .collection("rna")
                .find({}, { limit: 5, projection: { _id: 0 } })
                .toArray()) as unknown as RnaDbo[];
            expect(documents.map(doc => ({ ...doc, "maj-time": expect.any(Date) }))).toMatchSnapshot();
        });

        it("logs import in data-log", async () => {
            await cli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec.parquet"), "2026-07-17");
            expect(await db.collection("data-log").findOne({}, { projection: { _id: 0 } })).toMatchSnapshot({
                integrationDate: expect.any(Date),
            });
        });

        it("notify results", async () => {
            const EXPORT_DATE_STR = "2026-07-17";
            const spyNotify = jest.spyOn(notifyService, "notify");
            await cli.parse(path.resolve(__dirname, "../__fixtures__/rna-waldec.parquet"), EXPORT_DATE_STR);
            expect(spyNotify).toHaveBeenCalledWith(NotificationType.DATA_IMPORT_SUCCESS, {
                providerName: "RNA",
                exportDate: new Date(EXPORT_DATE_STR),
                details: {
                    fileName: "rna-waldec.parquet",
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
