import { loadHyparquet } from "./hyparquet.loader";

export type ParquetRow<T = Record<string, unknown>> = T;

export class ParquetParser<T> {
    static READ_BATCH_SIZE = 5000;

    constructor(private readonly batchSize = ParquetParser.READ_BATCH_SIZE) {}

    async *parse(filePath: string): AsyncGenerator<ParquetRow<T>[]> {
        const { asyncBufferFromFile, parquetMetadataAsync, parquetReadObjects, compressors } = await loadHyparquet();

        const file = await asyncBufferFromFile(filePath);
        const metadata = await parquetMetadataAsync(file);

        for (const [index, group] of metadata.row_groups.entries()) {
            console.log(`Row groupe ${index} size: `, group.num_rows);
        }

        let groupStart = 0;

        // iterate of each row group to avoid reading multiple time the same groups
        for (const group of metadata.row_groups) {
            const groupEnd = groupStart + Number(group.num_rows);

            const rows = (await parquetReadObjects({
                file,
                compressors,
                metadata,
                rowFormat: "object",
                rowStart: groupStart,
                rowEnd: groupEnd,
            })) as ParquetRow<T>[];

            // then because row group can be larger than batchSize, we split it by yielding expected batch
            for (let i = 0; i < rows.length; i += this.batchSize) {
                yield rows.slice(i, i + this.batchSize);
            }

            groupStart = groupEnd;
        }
    }
}

const parquetParser = new ParquetParser();
export default parquetParser;
