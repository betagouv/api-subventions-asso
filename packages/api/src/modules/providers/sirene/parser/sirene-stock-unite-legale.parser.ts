import fs from "fs";

import SireneUniteLegaleDto from "../@types/SireneUniteLegaleDto";
import { loadHyparquet } from "../../../../adapters/inputs/hyparquet.loader";

export default class SireneStockUniteLegaleParser {
    static READ_BATCH_SIZE = 5000;

    static async *parse(filePath: string): AsyncGenerator<SireneUniteLegaleDto[]> {
        this.filePathValidator(filePath);

        console.info("\nStart parsing file: ", filePath);

        const { asyncBufferFromFile, parquetMetadataAsync, parquetReadObjects, compressors } = await loadHyparquet();
        const file = await asyncBufferFromFile(filePath);
        const metadata = await parquetMetadataAsync(file);
        const totalRows = Number(metadata.num_rows);

        let currentRow = 0;

        const interval = setInterval(() => {
            console.info(`Parsing: ${this.formatProgress(currentRow, totalRows)}`);
        }, 5000);

        try {
            for (let rowStart = 0; rowStart < totalRows; rowStart += this.READ_BATCH_SIZE) {
                const rowEnd = Math.min(rowStart + this.READ_BATCH_SIZE, totalRows);
                const rows = (await parquetReadObjects({
                    file,
                    compressors,
                    metadata,
                    rowFormat: "object",
                    rowStart,
                    rowEnd,
                })) as Record<string, unknown>[];

                currentRow += rows.length;
                yield rows.map(rawData => this.parquetRowToDto(rawData));
            }

            console.info("Finished parsing file.");
        } finally {
            clearInterval(interval);
        }
    }

    static filePathValidator(file: string) {
        if (!file) throw new Error("Parse command need file args");
        if (!fs.existsSync(file)) throw new Error(`File not found ${file}`);
        return true;
    }

    static parquetRowToDto(data: Record<string, unknown>) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, this.normalizeParquetValue(value)]),
        ) as unknown as SireneUniteLegaleDto;
    }

    static normalizeParquetValue(value: unknown): string {
        if (value === null || value === undefined) return "";
        if (value instanceof Date) {
            const isoDate = value.toISOString();
            if (isoDate.endsWith("T00:00:00.000Z")) return isoDate.slice(0, 10);
            return isoDate.replace(".000Z", "");
        }
        if (typeof value === "bigint") return value.toString();
        if (typeof value === "boolean") return value ? "true" : "";
        return String(value);
    }

    static formatProgress(current: number, total: number): string {
        if (!total) return `${current}/0 (0%)`;
        return `${current}/${total} (${((current / total) * 100).toFixed(2)}%)`;
    }
}
