import { readFile, utils } from "xlsx";

export default abstract class Parser {
    static read(filePath: string, page = 0) {
        const workbook = readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[page]];
        const data = utils.sheet_to_json(worksheet);
        return data;
    }
}
