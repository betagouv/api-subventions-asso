import fs from "fs";
import CliLogger from "./CliLogger";
import { GenericParser } from "./GenericParser";

export default class CliController {
    protected logFileParsePath = "";
    protected logger = new CliLogger();

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
     * @param exportDate Explicite date of import (any valid date string, like "YYYY-MM-DD")
     * @returns
     */
    public async parse(file: string, exportDate?: string): Promise<unknown> {
        this.validParseFile(file);
        this.validFileExists(file);
        const files = GenericParser.findFiles(file);
        const logs: unknown[] = [];

        this.logger.logIC(`${files.length} files in the parse queue`);
        this.logger.logIC(`You can read log in ${this.logFileParsePath}`);

        return (
            files
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
                )
        );
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
}
