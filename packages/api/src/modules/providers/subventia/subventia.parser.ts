import fs from "fs";
import { GenericParser } from "../../../shared/GenericParser";
import SubventiaDto from "./@types/subventia.dto";

export default class SubventiaParser {
    static parse(filePath: string): SubventiaDto[] {
        this.filePathValidator(filePath);
        const fileContent = this.getBuffer(filePath);

        console.info("\nStart parse file: ", filePath);

        const data = GenericParser.xlsxParse(fileContent)[0].data; // single page
        const headers = data[0] as string[];
        const parsedData = data.slice(1).map(row => GenericParser.linkHeaderToData(headers, row)) as SubventiaDto[];

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
