import fs from "fs";
import path from "path";
import dataLogService from "../modules/data-log/dataLog.service";
import CliLogger from "./CliLogger";
import { GenericParser } from "./GenericParser";
import { validateDate } from "./helpers/CliHelper";
import { ImportReport } from "../@types/ImportReport";
import importNotifier, { type ImportNotifier } from "../adapters/inputs/pipeline/import/import-notifier";

export default abstract class CliController {
    protected logFileParsePath = "";
    protected logger = new CliLogger();
    protected _serviceMeta = { id: "", name: "" };
    protected readonly notifier: ImportNotifier;

    constructor(notifier?: ImportNotifier) {
        // @TODO: remove this after editing all CLI to inject import notifier
        if (!notifier) this.notifier = importNotifier;
        else this.notifier = notifier;
    }

    private validParseFile(file: string): boolean {
        if (typeof file != "string") {
            throw new Error("Parse command needs file path args");
        } else return true;
    }

    private validFileExists(file: string): boolean {
        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        } else return true;
    }

    /**
     *
     * @param file Path to the file
     * @param exportDate This should be as close as possible to the end date of the data coverage period (i.e last day of the month if monthly export)
     * If not available, take the file's creation date or the file's reception date.
     * Accept "YYYY-MM-DD" format | TODO: make YYYY-MM-DD mandatory ?
     */
    public async parse(file: string, exportDateString: string, ...args): Promise<void> {
        validateDate(exportDateString);
        const exportDate = new Date(exportDateString);

        this.validParseFile(file);
        this.validFileExists(file);
        const files = GenericParser.findFiles(file);
        const logs: unknown[] = [];

        this.logger.logIC(`${files.length} files in the parse queue`);
        this.logger.logIC(`You can read log in ${this.logFileParsePath}`);

        const fileReports: { report: ImportReport | void; duration: number }[] = [];
        const startAt = Date.now();

        try {
            await files.reduce((acc, filePath) => {
                return acc.then(async () => {
                    const fileStartAt = Date.now();
                    const report = await this._parse(filePath, logs, exportDate, ...args);
                    const duration = Date.now() - fileStartAt;
                    fileReports.push({ report, duration });
                });
            }, Promise.resolve());

            fs.mkdirSync(path.dirname(this.logFileParsePath), { recursive: true });
            // @todo: remove "+ logs.join()" when all cli controllers has refactored with logger
            fs.writeFileSync(this.logFileParsePath, this.logger.getLogs() + logs.join(""), {
                flag: "w",
                encoding: "utf-8",
            });
            await this._logImportSuccess(exportDate, file);

            const reportsWithCounts = fileReports
                .map(({ report }) => report)
                .filter((report): report is ImportReport => !!report);

            if (reportsWithCounts.length > 0) {
                const aggregated: ImportReport = {
                    parsedCount: reportsWithCounts.reduce((sum, r) => sum + r.parsedCount, 0),
                    importedCount: reportsWithCounts.reduce((sum, r) => sum + r.importedCount, 0),
                    errorCount: reportsWithCounts.reduce((sum, r) => sum + r.errorCount, 0),
                };
                const totalDuration = fileReports.reduce((sum, { duration }) => sum + duration, 0);
                await this.notifier.notifySuccess({
                    providerName: this._serviceMeta.name,
                    file,
                    report: aggregated,
                    context: {
                        durationMs: totalDuration,
                        exportDate,
                        fileCount: files.length,
                    },
                });
            }
        } catch (error) {
            const partialReport: ImportReport = {
                parsedCount: fileReports.reduce((sum, { report }) => sum + (report?.parsedCount ?? 0), 0),
                importedCount: fileReports.reduce((sum, { report }) => sum + (report?.importedCount ?? 0), 0),
                errorCount: fileReports.reduce((sum, { report }) => sum + (report?.errorCount ?? 0), 0),
            };
            await this.notifier.notifyFailure({
                providerName: this._serviceMeta.name,
                error: error as Error,
                context: { fileName: file, exportDate, durationMs: Date.now() - startAt, report: partialReport },
            });
            throw error;
        }
    }

    protected async _parse(_file: string, _logs: unknown[], _exportDate: Date, ..._args): Promise<ImportReport | void> {
        throw new Error("_parse() need to be implemented by the child class");
    }

    protected async _logImportSuccess(editionDate: Date, fileName: string) {
        if (!this._serviceMeta) throw new Error("'_serviceMeta' needs to be defined by the child class");
        return dataLogService.addFromFile({
            providerId: this._serviceMeta.id,
            providerName: this._serviceMeta.name,
            fileName: fileName,
            editionDate,
        });
    }

    protected async _notifyImportFailure(
        file: string,
        error: Error,
        exportDate: Date,
        durationMs: number,
        partialReport?: ImportReport,
    ): Promise<void> {
        return this.notifier.notifyFailure({
            providerName: this._serviceMeta.name,
            error,
            context: {
                exportDate,
                durationMs,
                fileName: path.basename(file),
                report: partialReport,
            },
        });
    }
}
