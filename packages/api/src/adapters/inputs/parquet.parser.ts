import { loadHyparquet } from "./hyparquet.loader";

export type ParquetRow<T = Record<string, unknown>> = T;

export class ParquetParser {
    static READ_BATCH_SIZE = 5000;

    constructor(private readonly batchSize = ParquetParser.READ_BATCH_SIZE) {}

    async *parse(filePath: string): AsyncGenerator<ParquetRow[]> {
        const { asyncBufferFromFile, parquetMetadataAsync, parquetReadObjects, compressors } = await loadHyparquet();

        const file = await asyncBufferFromFile(filePath);
        const metadata = await parquetMetadataAsync(file);
        const totalRows = Number(metadata.num_rows);

        for (let rowStart = 0; rowStart < totalRows; rowStart += this.batchSize) {
            const rowEnd = Math.min(rowStart + this.batchSize, totalRows);
            const batch = (await parquetReadObjects({
                file,
                compressors,
                metadata,
                rowFormat: "object",
                rowStart,
                rowEnd,
            })) as ParquetRow[];

            yield batch;
        }
    }
}

const parquetParser = new ParquetParser();
export default parquetParser;
