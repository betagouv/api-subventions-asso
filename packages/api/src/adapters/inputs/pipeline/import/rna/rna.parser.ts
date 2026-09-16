import parquetParser, { ParquetParser } from "../../../parquet.parser";
import { RnaWaldecDto } from "./rna.dto";

export class RnaParser {
    constructor(private readonly parser: ParquetParser = parquetParser) {}

    parse(filePath: string): AsyncGenerator<RnaWaldecDto[]> {
        return this.parser.parse(filePath) as AsyncGenerator<RnaWaldecDto[]>;
    }
}
const rnaParser = new RnaParser();
export default rnaParser;
