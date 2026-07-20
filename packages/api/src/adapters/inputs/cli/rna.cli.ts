import { ImportReport } from "../../../@types/ImportReport";
import CliController from "../../../shared/CliController";
import { RnaPipeline } from "../pipeline/import/rna/rna.pipeline";

export class RnaCli extends CliController {
    static cmdName = "rna";

    logFileParsePath = "./logs/rna.import.log.text";

    constructor(public pipeline: RnaPipeline) {
        super();

        // @TODO: thoses info where imported from services but the new architecture will remove them
        // @TODO: find a way to keep data stored in the domain to be used across all needed parts
        this._serviceMeta = { id: "rna", name: "RNA" };
    }

    async _parse(filePath: string): Promise<ImportReport> {
        return await this.pipeline.run(filePath);
    }
}
