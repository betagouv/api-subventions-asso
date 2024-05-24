import fs from "fs";
import * as ParseHelper from "../../../shared/helpers/ParserHelper";
//import { isSiret } from "../../../shared/Validators";

//import SubventiaLineEntity from "./entities/SubventiaLineEntity";

//import ISubventiaIndexedInformation from "./@types/ISubventiaIndexedInformation";

/* still to do :
 0) Est-ce que les valeurs associés à un status sont uniformisé entre les differentes sources de données ?
 1) validate application in
 2) validate indexed informations



*/
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
