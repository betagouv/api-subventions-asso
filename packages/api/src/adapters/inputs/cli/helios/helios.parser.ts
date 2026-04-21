import Parser from "../../abstract-parser";
import HeliosDto from "./helios.dto";

export default class HeliosParser extends Parser {
    static parse(filePath: string) {
        const data = this.read(filePath);
        return data as HeliosDto[];
    }
}
