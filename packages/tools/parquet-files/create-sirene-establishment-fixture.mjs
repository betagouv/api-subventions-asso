import { asyncBufferFromFile, parquetMetadataAsync, parquetSchema } from "hyparquet";
import { parquetWriteFile } from "hyparquet-writer";

const INPUT = process.argv[2];
const OUTPUT_DIR = process.argv[3] ?? "../api/tests/adapters/inputs/__fixtures__";

if (!INPUT) throw new Error("You must provide a source file");

const data = [
    {
        siren: "100000000",
        nic: "00001",
        siret: "10000000000001",
        dateDernierTraitementEtablissement: new Date("2026-07-21T12:00:00.000+02:00"),
        etablissementSiege: true,
        numeroVoieEtablissement: "1",
        typeVoieEtablissement: "RUE",
        libelleVoieEtablissement: "RIRI",
        codePostalEtablissement: "75001",
        libelleCommuneEtablissement: "PARIS",
        codeCommuneEtablissement: "75101",
        codePaysEtrangerEtablissement: null,
        libellePaysEtrangerEtablissement: null,
    },
    {
        siren: "100000000",
        nic: "00002",
        siret: "10000000000002",
        dateDernierTraitementEtablissement: new Date("2026-07-21T12:00:00.000+02:00"),
        etablissementSiege: false,
        numeroVoieEtablissement: "2",
        typeVoieEtablissement: "RUE",
        libelleVoieEtablissement: "FIFI",
        codePostalEtablissement: "75002",
        libelleCommuneEtablissement: "PARIS",
        codeCommuneEtablissement: "75102",
        codePaysEtrangerEtablissement: null,
        libellePaysEtrangerEtablissement: null,
    },
    {
        siren: "111222333",
        nic: "00003",
        siret: "11122233300003",
        dateDernierTraitementEtablissement: new Date("2026-07-21T12:00:00.000+02:00"),
        etablissementSiege: true,
        numeroVoieEtablissement: "3",
        typeVoieEtablissement: "RUE",
        libelleVoieEtablissement: "LOULOU",
        codePostalEtablissement: "75003",
        libelleCommuneEtablissement: "PARIS",
        codeCommuneEtablissement: "75103",
        codePaysEtrangerEtablissement: null,
        libellePaysEtrangerEtablissement: null,
    },
];

// generate 5001 importable rows from 2 establishments with synthetic unique nic and siret (avoiding duplicate siret errors)
function buildMultipleBatchData() {
    const importableEstablishments = data.slice(0, 2);

    return Array.from({ length: 5001 }, (_, index) => {
        const establishment = importableEstablishments[index % importableEstablishments.length];
        const nic = String(index + 1).padStart(5, "0");

        return {
            ...establishment,
            nic,
            siret: `${establishment.siren}${nic}`,
        };
    });
}

function writeFixture(filename, rows, schema) {
    const columnData = schema.children.map(({ element }) => ({
        name: element.name,
        data: rows.map(row => (Object.hasOwn(row, element.name) ? row[element.name] : null)),
    }));

    parquetWriteFile({ filename, columnData });
    console.log(`Wrote ${rows.length} rows to ${filename}`);
}

async function main() {
    const file = await asyncBufferFromFile(INPUT);
    const metadata = await parquetMetadataAsync(file);
    const schema = parquetSchema(metadata);

    writeFixture(`${OUTPUT_DIR}/sirene-establishment.parquet`, data, schema);
    writeFixture(`${OUTPUT_DIR}/multiple-batch.sirene-establishment.parquet`, buildMultipleBatchData(), schema);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
