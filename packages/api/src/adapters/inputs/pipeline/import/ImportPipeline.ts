import { ImportReport } from "../../../../@types/ImportReport";

export abstract class ImportPipeline {
    protected report: ImportReport;

    constructor() {
        this.report = {
            parsedCount: 0,
            importedCount: 0,
            errorCount: 0, // no validation or format error here
        };
    }

    protected abstract run(filePath: string): Promise<ImportReport>;
}
