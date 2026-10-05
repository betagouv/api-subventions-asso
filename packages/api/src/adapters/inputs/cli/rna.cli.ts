import { ImportReport } from "../../../@types/ImportReport";
import CliController from "../../../shared/CliController";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { rnaWaldecAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import importNotifier, { ImportNotifier } from "../pipeline/import/import-notifier";
import rnaPipeline, { RnaPipeline } from "../pipeline/import/rna/rna.pipeline";

export class RnaCli extends CliController {
    static cmdName = "rna";

    logFileParsePath = "./logs/rna.import.log.text";

    constructor(
        public pipeline: RnaPipeline,
        private download: DownloadFile,
        private remove: RemoveFile,
        notifier: ImportNotifier,
    ) {
        super(notifier);

        // @TODO: thoses info where imported from services but the new architecture will remove them
        // @TODO: find a way to keep data stored in the domain to be used across all needed parts
        this._serviceMeta = { id: "rna", name: "RNA" };
    }

    async _parse(filePath: string): Promise<ImportReport> {
        return await this.pipeline.run(filePath);
    }

    async import() {
        return new DownloadAndImport(this, this.download, this.remove).run();
    }
}

const rnaCli = new RnaCli(rnaPipeline, new DownloadFile(rnaWaldecAdapter), new RemoveFile(), importNotifier);
export default rnaCli;
