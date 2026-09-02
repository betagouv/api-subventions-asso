import { asyncBufferFromFile, parquetReadObjects, parquetMetadataAsync, parquetSchema } from "hyparquet";
import { compressors } from "hyparquet-compressors";
import { parquetWriteFile } from "hyparquet-writer";

const INPUT = process.argv[2];

if (!INPUT) throw new Error("You must provide a source file");

const OUTPUT = process.argv[3] ?? "fixture.parquet";
const NB_ROWS = process.argv[4] ?? 5001; // we generally batch over 5000 so it makes two batch for test purpose

async function main() {
    const file = await asyncBufferFromFile(INPUT);

    const rows = await parquetReadObjects({
        file,
        compressors,
        rowStart: 0,
        rowEnd: NB_ROWS,
    });

    const metadata = await parquetMetadataAsync(file);
    const schema = parquetSchema(metadata);

    // retrieve column metadata
    const columnNames = Object.keys(rows[0]);
    const columnData = columnNames.map(name => {
        const schemaCol = schema.children.find(children => children.element.name === name);
        console.log(schema.children);
        return {
            name,
            data: rows.map(row => row[name]),
            ...(schemaCol?.element.type ? { type: schemaCol.element.type } : {}),
        };
    });

    // 3. Write the fixture file
    parquetWriteFile({ filename: OUTPUT, columnData });

    console.log(`Wrote ${rows.length} rows to ${OUTPUT}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
