import fs from "fs";
import { findFiles } from './helpers/ParserHelper';

export default class CliController {
    protected logFileParsePath = "";

    private validParseFile(file: string): boolean {
        if (typeof file != "string") {
            throw new Error("Parse command needs file path args");
        } else return true
    }

    private validFileExists(file: string): boolean {
        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        } else return true
    }

    public async parse(file: string): Promise<unknown> {
        this.validParseFile(file);
        this.validFileExists(file);
        const files = findFiles(file);
        const logs: unknown[] = [];

        console.info(`${files.length} files in the parse queue`);
        console.info(`You can read log in ${ this.logFileParsePath }`);

        return files.reduce((acc, filePath) => {
            return acc.then(() => this._parse(filePath, logs));
        }, Promise.resolve())
            .then(() => fs.writeFileSync(this.logFileParsePath, logs.join(''), { flag: "w", encoding: "utf-8" }));
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async _parse(file: string, logs: unknown[]) {
        throw new Error("_parse() need to be implemented by the child class");
    }
}