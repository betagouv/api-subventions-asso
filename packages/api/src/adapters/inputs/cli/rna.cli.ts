import CliController from "../../../shared/CliController";
import { RnaPipeline } from "../pipeline/import/rna/rna.pipeline";

export class RnaCli extends CliController {
    static cmdName = "rna";

    logFileParsePath = "./logs/rna.import.log.text";

    constructor(public pipeline: RnaPipeline) {
        super();
    }

    async _parse(filePath: string) {
        await this.pipeline.run(filePath);
    }
}
