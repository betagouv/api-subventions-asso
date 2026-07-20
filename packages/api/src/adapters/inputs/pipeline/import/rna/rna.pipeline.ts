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

export class RnaPipeline {
    constructor(
        public parser: RnaParser,
        public mapper: RnaMapper,
        public rnaPort: RnaPort,
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
        console.log(lastImportDate);
        if (lastImportDate)
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
                            await this.rnaPort.insertMany(dbos);
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

const rnaPipeline = new RnaPipeline(rnaParser, rnaMapper, rnaAdapter, dataLogAdapter);
export default rnaPipeline;
