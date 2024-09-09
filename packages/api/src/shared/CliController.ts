import fs from "fs";
import dataLogService from "../modules/data-log/dataLog.service";
import CliLogger from "./CliLogger";
import { GenericParser } from "./GenericParser";
import { isDateNewer, isValidDate } from "./helpers/DateHelper";
import ExportDateError from "./errors/cliErrors/FormatDateError";
import OutOfRangeDateError from "./errors/cliErrors/OutOfRangeDateError";
import ObsoleteDateError from "./errors/cliErrors/ObsoleteDateError";

export default class CliController {
    protected logFileParsePath = "";
    protected logger = new CliLogger();
    protected _providerIdToLog = "";

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
     * @param exportDate This should be as close as possible as the end date of the data coverage period (i.e last day of the month if monthely export)
     * If not available, take the file's creation date or the file's reception date.
     * Accept "YYYY-MM-DD" format | TODO: make YYYY-MM-DD mandatory ?
     */
    public async parse(file: string, exportDateString: string): Promise<void> {
        const exportDate = new Date(exportDateString);

        if (Number(exportDateString.split("-")[0]) < 2018) throw new ObsoleteDateError();
        if (!isValidDate(new Date(exportDate))) throw new ExportDateError();
        if (isDateNewer(exportDate, new Date())) throw new OutOfRangeDateError();

        this.validParseFile(file);
        this.validFileExists(file);
        const files = GenericParser.findFiles(file);
        const logs: unknown[] = [];

        this.logger.logIC(`${files.length} files in the parse queue`);
        this.logger.logIC(`You can read log in ${this.logFileParsePath}`);

        await files
            .reduce((acc, filePath) => {
                return acc.then(() =>
                    exportDate ? this._parse(filePath, logs, new Date(exportDate)) : this._parse(filePath, logs),
                );
            }, Promise.resolve())
            // @todo: remove "+ logs.join()" when all cli controllers has refactored with logger
            .then(() =>
                fs.writeFileSync(this.logFileParsePath, this.logger.getLogs() + logs.join(""), {
                    flag: "w",
                    encoding: "utf-8",
                }),
            );
        await this._logImportSuccess(new Date(exportDate), file);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async _parse(file: string, logs: unknown[], exportDate?: Date) {
        throw new Error("_parse() need to be implemented by the child class");
    }

    public async compare(previousFile: string, newFile: string) {
        this.validParseFile(previousFile);
        this.validParseFile(newFile);
        this.validFileExists(previousFile);
        this.validFileExists(newFile);

        this._compare(previousFile, newFile);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async _compare(previousFile: string, newFile: string): Promise<boolean> {
        throw new Error("_compare() need to be implemented by the child class");
    }

    protected async _logImportSuccess(editionDate: Date, fileName?: string) {
        if (!this._providerIdToLog) throw new Error("'_providerIdToLog' needs to be defined by the child class");
        return dataLogService.addLog(this._providerIdToLog, editionDate, fileName);
    }
}
