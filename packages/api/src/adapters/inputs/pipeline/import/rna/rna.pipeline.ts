import { pipeline } from "stream/promises";
import rnaMapper, { RnaMapper } from "./rna.mapper";
import rnaAdapter from "../../../../outputs/db/rna/rna.adapter";
import { Readable, Transform, Writable } from "stream";
import { RnaWaldecDto } from "./rna.dto";
import RnaDbo from "../../../../outputs/db/rna/rna.dbo";
import { RnaPort } from "../../../../outputs/db/rna/rna.port";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import dataLogAdapter from "../../../../outputs/db/data-log/data-log.adapter";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";
import { ImportPipeline } from "../import-pipeline";
import { ParquetParser } from "../../../parquet.parser";

export class RnaPipeline extends ImportPipeline {
    constructor(
        public parser: ParquetParser<RnaWaldecDto>,
        public mapper: RnaMapper,
        public rnaPort: RnaPort,
        public searchPort: AssociationSearchPort,
        public logPort: DataLogPort,
    ) {
        super();
    }

    async run(filePath: string) {
        const stages: (Readable | Transform | Writable)[] = [Readable.from(this.parser.parse(filePath))];

        const lastImportDate = await this.logPort.getLastImportByProvider("rna");

        if (lastImportDate) {
            console.log(`Updating RNA Waldec since ${lastImportDate}`);
            stages.push(
                new Transform({
                    objectMode: true,
                    transform: (batch: RnaWaldecDto[], _enc, callback) => {
                        try {
                            callback(
                                null,
                                batch.filter(dto => new Date(dto.maj_time!) > lastImportDate),
                            );
                        } catch (err) {
                            callback(err as Error);
                        }
                    },
                }),
            );
        } else console.log("Starting first RNA waldec importation");

        stages.push(
            new Transform({
                objectMode: true,
                transform: (batch: RnaWaldecDto[], _enc, callback) => {
                    this.report.parsedCount += batch.length;
                    try {
                        const dbos = batch.map(row => this.mapper.toDbo(row));
                        callback(null, dbos);
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
            new Writable({
                objectMode: true,
                write: async (dbos: RnaDbo[], _enc, callback) => {
                    console.log(`Writting ${dbos.length} RNA documents`);
                    try {
                        if (dbos.length > 0) {
                            await this.searchPort.upsertFromRna(
                                dbos
                                    // @TODO: remove this filter if we also use siren name
                                    .filter(dbo => dbo.titre) // in rare cases rna document can miss the titre and this would break association-search update
                                    .map(dbo =>
                                        this.mapper.toAssociationSearch(
                                            dbo as Omit<RnaDbo, "titre"> & { titre: string },
                                        ),
                                    ),
                            );
                            if (lastImportDate) await this.rnaPort.upsertMany(dbos);
                            else await this.rnaPort.insertMany(dbos);
                            this.report.importedCount += dbos.length;
                            console.log(`Upserted ${dbos.length} new Rna documents`);
                        }
                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        );

        await pipeline(stages);
        return this.report;
    }
}

const rnaPipeline = new RnaPipeline(
    new ParquetParser<RnaWaldecDto>(),
    rnaMapper,
    rnaAdapter,
    associationSearchAdapter,
    dataLogAdapter,
);
export default rnaPipeline;
