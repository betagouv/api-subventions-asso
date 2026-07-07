import fs from "fs";
import SireneEtablissementDto, { SIRENE_ETABLISSEMENT_DTO_FIELDS } from "../@types/SireneEtablissementDto";
import { SireneEtablissementEntity } from "../../../../entities/SireneEtablissementEntity";
import SireneEtablissementMapper from "../mappers/sirene-etablissement.mapper";

export default class SireneStockEtablissementParser {
    static BATCH_SIZE = 1000;

    static async parseParquetAndInsert(
        filePath: string,
        findAssociationSirens: (sirens: string[]) => Promise<string[]>,
        saveBatchData: (batch: SireneEtablissementEntity[]) => Promise<void>,
    ): Promise<void> {
        if (!filePath) throw new Error("Parse command need file args");
        if (!fs.existsSync(filePath)) throw new Error(`File not found ${filePath}`);

        console.info("\nStart parsing file: ", filePath);

        const { asyncBufferFromFile, parquetMetadataAsync, parquetRead } = await import("hyparquet");
        const { compressors } = await import("hyparquet-compressors");

        const file = await asyncBufferFromFile(filePath);
        const metadata = await parquetMetadataAsync(file);
        const totalRows = Number(metadata.num_rows);

        let batch: SireneEtablissementEntity[] = [];
        let currentRow = 0;

        const interval = setInterval(() => {
            console.info(`Parsing: ${this.formatProgress(currentRow, totalRows)}`);
        }, 5000);

        try {
            let rowStart = 0;

            for (const rowGroup of metadata.row_groups) {
                const rowEnd = rowStart + Number(rowGroup.num_rows);
                let rows: Record<string, unknown>[] = [];

                await parquetRead({
                    file,
                    metadata,
                    rowStart,
                    rowEnd,
                    rowFormat: "object",
                    columns: SIRENE_ETABLISSEMENT_DTO_FIELDS,
                    compressors,
                    onComplete: data => {
                        rows = data;
                    },
                });

                const associationSirens = new Set(await findAssociationSirens(this.extractSirens(rows)));

                for (const row of rows) {
                    currentRow++;
                    if (!associationSirens.has(row.siren as string)) continue;

                    batch.push(SireneEtablissementMapper.dtoToEntity(row as unknown as SireneEtablissementDto));

                    if (batch.length === this.BATCH_SIZE) {
                        const batchToSave = batch;
                        batch = [];

                        await saveBatchData(batchToSave);
                    }
                }

                rowStart = rowEnd;
            }

            if (batch.length > 0) await saveBatchData(batch);

            console.info("Finished parsing file.");
        } finally {
            clearInterval(interval);
        }
    }

    private static extractSirens(rows: Record<string, unknown>[]): string[] {
        return [...new Set(rows.map(row => row.siren).filter((siren): siren is string => typeof siren === "string"))];
    }

    static formatProgress(current: number, total: number): string {
        if (!total) return `${current}/0 (0%)`;
        return `${current}/${total} (${((current / total) * 100).toFixed(2)}%)`;
    }
}
