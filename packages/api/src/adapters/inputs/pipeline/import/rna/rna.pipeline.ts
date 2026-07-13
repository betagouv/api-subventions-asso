import { pipeline } from "stream/promises";
import rnaParser, { RnaParser } from "./rna.parser";
import rnaMapper, { RnaMapper } from "./rna.mapper";
import rnaAdapter, { RnaAdapter } from "../../../../outputs/db/rna/rna.adapter";
import { Readable, Transform, Writable } from "stream";
import { RnaWaldecDto } from "./rna.dto";
import RnaDbo from "../../../../outputs/db/rna/rna.dbo";

export class RnaPipeline {
    constructor(
        public parser: RnaParser,
        public mapper: RnaMapper,
        public adapter: RnaAdapter,
    ) {}

    async run(filePath: string) {
        await pipeline(
            Readable.from(this.parser.parse(filePath)),
            new Transform({
                objectMode: true,
                transform: (batch: RnaWaldecDto[], _enc, callback) => {
                    try {
                        const dbos = batch.map(row => this.mapper.map(row));
                        console.log("transformed batch", dbos[0]);
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
                            console.log(dbos[0]);
                            await this.adapter.insertMany(dbos);
                            console.log(`inserted ${dbos.length} new Rna documents`);
                        }
                        callback();
                    } catch (err) {
                        callback(err as Error);
                    }
                },
            }),
        );
    }
}
const rnaPipeline = new RnaPipeline(rnaParser, rnaMapper, rnaAdapter);
export default rnaPipeline;
