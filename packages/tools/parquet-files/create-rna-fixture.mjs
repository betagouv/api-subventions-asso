import { asyncBufferFromFile, parquetMetadataAsync, parquetSchema } from "hyparquet";
import { parquetWriteFile } from "hyparquet-writer";

const INPUT = process.argv[2];

if (!INPUT) throw new Error("You must provide a source file");

const OUTPUT = process.argv[3] ?? "fixture.parquet";

async function main() {
    const file = await asyncBufferFromFile(INPUT);

    const metadata = await parquetMetadataAsync(file);
    const schema = parquetSchema(metadata);

    const data = [
        {
            id: "W000000001",
            id_ex: "0421005762",
            siret: null,
            rup_mi: null,
            gestion: "691P",
            date_creat: "2004-02-19T00:00:00.000Z",
            date_decla: "2016-12-07T00:00:00.000Z",
            date_publi: "2016-12-07T00:00:00.000Z",
            date_disso: "2016-02-11T00:00:00.000Z",
            nature: "D",
            groupement: "S",
            titre: "ASSOCIATION 1",
            titre_court: "ASSO 1",
            objet: "objet association 1",
            objet_social1: "006100",
            objet_social2: "006100",
            adrs_complement: null,
            adrs_numvoie: null,
            adrs_repetition: " ",
            adrs_typevoie: null,
            adrs_libvoie: "La Cote ndeg 9",
            adrs_distrib: null,
            adrs_codeinsee: "69110",
            adrs_codepostal: "69590",
            adrs_libcommune: "Larajasse",
            adrg_declarant: null,
            adrg_complemid: null,
            adrg_complemgeo: null,
            adrg_libvoie: "La Cote ndeg 9",
            adrg_distrib: "69590",
            adrg_codepostal: "69590",
            adrg_achemine: "LARAJASSE",
            adrg_pays: "FRANCE",
            dir_civilite: "PF",
            siteweb: null,
            publiweb: "1",
            observation: null,
            position: "D",
            maj_time: "2016-12-15T14:07:21.000Z", // used in integ test so becareful updating this
        },
        {
            id: "W000000002",
            id_ex: "0421005762",
            siret: null,
            rup_mi: null,
            gestion: "691P",
            date_creat: "2014-02-19T00:00:00.000Z",
            date_decla: "2016-12-07T00:00:00.000Z",
            date_publi: "2016-12-07T00:00:00.000Z",
            date_disso: null,
            nature: "D",
            groupement: "S",
            titre: "ASSOCIATION 2",
            titre_court: "ASSO 2",
            objet: "object association 2",
            objet_social1: null,
            objet_social2: null,
            adrs_complement: null,
            adrs_numvoie: null,
            adrs_repetition: " ",
            adrs_typevoie: null,
            adrs_libvoie: "Impasse de la sensive",
            adrs_distrib: null,
            adrs_codeinsee: null,
            adrs_codepostal: "22215",
            adrs_libcommune: "Ploufragan",
            adrg_declarant: null,
            adrg_complemid: null,
            adrg_complemgeo: null,
            adrg_libvoie: "Impasse de la sensive",
            adrg_distrib: "22215",
            adrg_codepostal: "22215",
            adrg_achemine: "PLOUFRAGAN",
            adrg_pays: "FRANCE",
            dir_civilite: "PF",
            siteweb: null,
            publiweb: "1",
            observation: null,
            position: "D",
            maj_time: "2024-12-15T14:07:21.000Z", // used in integ test so becareful updating this
        },
        {
            id: "W000000003",
            id_ex: "0421005762",
            siret: null,
            rup_mi: null,
            gestion: "691P",
            date_creat: "2020-02-19T00:00:00.000Z",
            date_decla: "2020-02-24T00:00:00.000Z",
            date_publi: "2020-02-27T00:00:00.000Z",
            date_disso: null,
            nature: "D",
            groupement: "S",
            titre: "ASSOCIATION 3",
            titre_court: "ASSO 3",
            objet: "object association 3",
            objet_social1: null,
            objet_social2: null,
            adrs_complement: null,
            adrs_numvoie: null,
            adrs_repetition: " ",
            adrs_typevoie: null,
            adrs_libvoie: "Rue Alexandre Lefas",
            adrs_distrib: null,
            adrs_codeinsee: null,
            adrs_codepostal: "35700",
            adrs_libcommune: "Rennes",
            adrg_declarant: null,
            adrg_complemid: null,
            adrg_complemgeo: null,
            adrg_libvoie: "Rue Alexandre Lefas",
            adrg_distrib: "35700",
            adrg_codepostal: "35700",
            adrg_achemine: "RENNES",
            adrg_pays: "FRANCE",
            dir_civilite: "PF",
            siteweb: null,
            publiweb: "1",
            observation: null,
            position: "D",
            maj_time: "2026-12-15T14:07:21.000Z", // used in integ test so becareful updating this
        },
    ];

    // retrieve column metadata
    const columnNames = Object.keys(data[0]);
    const columnData = columnNames.map(name => {
        const schemaCol = schema.children.find(children => children.element.name === name);
        return {
            name,
            data: data.map(row => row[name]),
            ...(schemaCol?.element.type ? { type: schemaCol.element.type } : {}),
        };
    });

    // 3. Write the fixture file
    parquetWriteFile({ filename: OUTPUT, columnData });

    console.log(`Wrote ${data.length} rows to ${OUTPUT}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
