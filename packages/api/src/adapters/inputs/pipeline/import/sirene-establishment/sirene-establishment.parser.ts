import fs from "fs";
import SireneEstablishmentDto, { SIRENE_ESTABLISHMENT_DTO_FIELDS } from "./sirene-establishment.dto";

export default class SireneEstablishmentParser {
    static BATCH_SIZE = 1000;

    public async parse(filePath: string, onBatch: (batch: SireneEstablishmentDto[]) => Promise<void>): Promise<number> {
        if (!filePath) throw new Error("Parse command need file args");
        if (!fs.existsSync(filePath)) throw new Error(`File not found ${filePath}`);

        console.info("\nStart parsing file: ", filePath);

        const { asyncBufferFromFile, parquetMetadataAsync, parquetRead } = await import("hyparquet");
        const { compressors } = await import("hyparquet-compressors");

        const file = await asyncBufferFromFile(filePath);
        const metadata = await parquetMetadataAsync(file);
        const totalRows = Number(metadata.num_rows);

        let batch: SireneEstablishmentDto[] = [];
        let currentRow = 0;

        const interval = setInterval(() => {
            console.info(`Parsing: ${SireneEstablishmentParser.formatProgress(currentRow, totalRows)}`);
        }, 5000);

        try {
            let rowStart = 0;

            for (const rowGroup of metadata.row_groups) {
                const rowEnd = rowStart + Number(rowGroup.num_rows);
                let rows: SireneEstablishmentDto[] = [];

                await parquetRead({
                    file,
                    metadata,
                    rowStart,
                    rowEnd,
                    rowFormat: "object",
                    columns: SIRENE_ESTABLISHMENT_DTO_FIELDS,
                    compressors,
                    onComplete: data => {
                        rows = data as SireneEstablishmentDto[];
                    },
                });

                for (const row of rows) {
                    currentRow++;
                    batch.push(row);

                    if (batch.length === SireneEstablishmentParser.BATCH_SIZE) {
                        const batchToSave = batch;
                        batch = [];
                        await onBatch(batchToSave);
                    }
                }

                rowStart = rowEnd;
            }

            if (batch.length > 0) await onBatch(batch);

            console.info("Finished parsing file.");
            return currentRow;
        } finally {
            clearInterval(interval);
        }
    }

    static formatProgress(current: number, total: number): string {
        if (!total) return `${current}/0 (0%)`;
        return `${current}/${total} (${((current / total) * 100).toFixed(2)}%)`;
    }
}
