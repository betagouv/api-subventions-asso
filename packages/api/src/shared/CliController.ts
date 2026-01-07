import fs from "fs";
import dataLogService from "../modules/data-log/dataLog.service";
import CliLogger from "./CliLogger";
import { GenericParser } from "./GenericParser";
import { validateDate } from "./helpers/CliHelper";

export default class CliController {
    protected logFileParsePath = "";
    protected logger = new CliLogger();
    protected _serviceMeta = { id: "", name: "" };

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

        await files
            .reduce((acc, filePath) => {
                return acc.then(() => this._parse(filePath, logs, exportDate, ...args));
            }, Promise.resolve())
            // @todo: remove "+ logs.join()" when all cli controllers has refactored with logger
            .then(() =>
                fs.writeFileSync(this.logFileParsePath, this.logger.getLogs() + logs.join(""), {
                    flag: "w",
                    encoding: "utf-8",
                }),
            );
        await this._logImportSuccess(exportDate, file);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async _parse(file: string, logs: unknown[], exportDate: Date, ..._args) {
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

    protected async _logImportSuccess(editionDate: Date, fileName: string) {
        if (!this._serviceMeta) throw new Error("'_serviceMeta' needs to be defined by the child class");
        return dataLogService.addFromFile({
            providerId: this._serviceMeta.id,
            providerName: this._serviceMeta.name,
            fileName: fileName,
            editionDate,
        });
    }
}
