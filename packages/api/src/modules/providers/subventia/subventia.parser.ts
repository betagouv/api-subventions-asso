import fs from "fs";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";

export default class SubventiaParser {
    static parse(filePath: string) {
        this.filePathValidator(filePath);
        const fileContent = this.getBuffer(filePath);

        console.info("\nStart parse file: ", filePath);

        const data = ParseHelper.xlsParse(fileContent)[0];
        const headers = data[0] as string[];
        const parsedData = data.slice(1).map(row => ParseHelper.linkHeaderToData(headers, row));

        return parsedData;
    }

    protected static getBuffer(file: string) {
        this.filePathValidator(file);

        console.log("Open and read file ...");

        return fs.readFileSync(file);
    }

    protected static filePathValidator(file: string) {
        if (!file) {
            throw new Error("Parse command need file args");
        }

        if (!fs.existsSync(file)) {
            throw new Error(`File not found ${file}`);
        }
        return true;
    }
}
