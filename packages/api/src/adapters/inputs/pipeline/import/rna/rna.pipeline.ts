import { pipeline } from "stream/promises";
import rnaParser, { RnaParser } from "./rna.parser";
import rnaMapper, { RnaMapper } from "./rna.mapper";
import rnaAdapter from "../../../../outputs/db/rna/rna.adapter";
import { Readable, Transform, Writable } from "stream";
import { RnaWaldecDto } from "./rna.dto";
import RnaDbo from "../../../../outputs/db/rna/rna.dbo";
import { ImportReport } from "../../../../../@types/ImportReport";
import { RnaPort } from "../../../../outputs/db/rna/rna.port";

export class RnaPipeline {
    constructor(
        public parser: RnaParser,
        public mapper: RnaMapper,
        public adapter: RnaPort,
    ) {}

    async run(filePath: string) {
        const report: ImportReport = {
            parsedCount: 0,
            importedCount: 0,
            errorCount: 0, // no validation or format error here
        };

        await pipeline(
            Readable.from(this.parser.parse(filePath)),
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
                            await this.adapter.insertMany(dbos);
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

        return report;
    }
}
const rnaPipeline = new RnaPipeline(rnaParser, rnaMapper, rnaAdapter);
export default rnaPipeline;
