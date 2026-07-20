import { loadHyparquet } from "../../../hyparquet.loader";
import { RnaWaldecDto } from "./rna.dto";

export class RnaParser {
    async *parse(filePath: string): AsyncGenerator<RnaWaldecDto[]> {
        const { asyncBufferFromFile, parquetMetadataAsync, parquetReadObjects, compressors } = await loadHyparquet();
        console.log(asyncBufferFromFile);

        const file = await asyncBufferFromFile(filePath);
        const metadata = await parquetMetadataAsync(file);

        const totalRows = Number(metadata.num_rows);

        const batchSize = 5000;

        for (let rowStart = 0; rowStart < totalRows; rowStart += batchSize) {
            const rowEnd = Math.min(rowStart + batchSize, totalRows);

            const batch = (await parquetReadObjects({
                file,
                compressors,
                metadata,
                rowStart,
                rowEnd,
            })) as RnaWaldecDto[];
            yield batch;
        }
    }
}
const rnaParser = new RnaParser();
export default rnaParser;
