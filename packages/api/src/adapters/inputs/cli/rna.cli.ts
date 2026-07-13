import CliController from "../../../shared/CliController";

export class RnaCli extends CliController {
    static cmdName = "rna";

    private BATCH_SIZE = 5000;

    async _parse(filePath) {
        const { asyncBufferFromFile, parquetRead, parquetMetadataAsync } = await import("hyparquet");
        const { compressors } = await import("hyparquet-compressors");

        const buffer = await asyncBufferFromFile(filePath);

        const metadata = await parquetMetadataAsync(buffer);
        const totalRows = Number(metadata.num_rows);

        console.log(`Parquet file is ${totalRows} rows long.`);

        for (let rowStart = 0; rowStart < totalRows; rowStart += this.BATCH_SIZE) {
            const rowEnd = Math.min(rowStart + this.BATCH_SIZE, totalRows);

            await parquetRead({
                file: buffer,
                compressors,
                rowFormat: "object",
                metadata,
                rowStart,
                rowEnd,
                onComplete: rows => {
                    console.log(`Processing rows ${rowStart}-${rowEnd}`, rows.length);
                },
            });
        }
    }
}
