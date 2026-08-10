import { CronController } from "../../../@types/CronController";
import { AsyncCron } from "../../../decorators/cron.decorator";
import { connectDB } from "../../../shared/MongoConnection";
import { initIndexes } from "../../../shared/MongoInit";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { rnaWaldecAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import { RnaCli } from "../cli/rna.cli";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import rnaPipeline from "../pipeline/import/rna/rna.pipeline";

export class RnaCron implements CronController {
    name = "rna";

    constructor(private pipeline: DownloadAndImport) {}

    // each 3 of the month at 5 am
    @AsyncCron({ cronExpression: "0 5 3 * *" })
    async import() {
        return this.pipeline.run();
    }
}

const rnaCron = new RnaCron(
    new DownloadAndImport(new RnaCli(rnaPipeline), new DownloadFile(rnaWaldecAdapter), new RemoveFile()),
);
export default rnaCron;

// used to manually test cron task
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main() {
    await connectDB();
    await initIndexes();
    await rnaCron.import();
}
