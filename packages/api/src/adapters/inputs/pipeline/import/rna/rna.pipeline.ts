import { pipeline } from "stream/promises";
import rnaParser, { RnaParser } from "./rna.parser";
import rnaMapper, { RnaMapper } from "./rna.mapper";
import rnaAdapter from "../../../../outputs/db/rna/rna.adapter";
import { Readable, Transform, Writable } from "stream";
import { RnaWaldecDto } from "./rna.dto";
import RnaDbo from "../../../../outputs/db/rna/rna.dbo";
import { ImportReport } from "../../../../../@types/ImportReport";
import { RnaPort } from "../../../../outputs/db/rna/rna.port";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
import dataLogAdapter from "../../../../outputs/db/data-log/data-log.adapter";
import { AssociationSearchPort } from "../../../../outputs/db/association-search/association-search.port";
import associationSearchAdapter from "../../../../outputs/db/association-search/association-search.adapter";

export class RnaPipeline {
    constructor(
        public parser: RnaParser,
        public mapper: RnaMapper,
        public rnaPort: RnaPort,
        public searchPort: AssociationSearchPort,
        public logPort: DataLogPort,
    ) {}

    async run(filePath: string) {
        const report: ImportReport = {
            parsedCount: 0,
            importedCount: 0,
            errorCount: 0, // no validation or format error here
        };

        const stages: (Readable | Transform | Writable)[] = [Readable.from(this.parser.parse(filePath))];

        const lastImportDate = await this.logPort.getLastImportByProvider("rna");

        if (lastImportDate) {
            console.log(`updating RNA Waldec since ${lastImportDate}`);
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
        } else console.log("starting first RNA waldec importation");

        stages.push(
            new Transform({
                objectMode: true,
                transform: (batch: RnaWaldecDto[], _enc, callback) => {
                    report.parsedCount += batch.length;
                    try {
                        const dbos = batch.map(row => this.mapper.map(row));
                        callback(null, dbos);
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
            new Writable({
                objectMode: true,
                write: async (dbos: RnaDbo[], _enc, callback) => {
                    try {
                        if (dbos.length > 0) {
                            console.log("Update association-search collection...");
                            await this.searchPort.upsertMany(
                                dbos
                                    .filter(dbo => dbo.titre) // in rare cases rna document can miss the titre and this would break association-search update
                                    .map(dbo =>
                                        this.mapper.toAssociationSearch(
                                            dbo as Omit<RnaDbo, "titre"> & { titre: string },
                                        ),
                                    ),
                            );

                            console.log("Persist new ");
                            if (lastImportDate) await this.rnaPort.upsertMany(dbos);
                            else await this.rnaPort.insertMany(dbos);
                            report.importedCount += dbos.length;
                            console.log(`inserted ${dbos.length} new Rna documents`);
                        }
                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        );

        await pipeline(stages);

        return report;
    }
}

const rnaPipeline = new RnaPipeline(rnaParser, rnaMapper, rnaAdapter, associationSearchAdapter, dataLogAdapter);
export default rnaPipeline;
