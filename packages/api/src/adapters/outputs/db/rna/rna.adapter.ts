import MongoAdapter from "../MongoAdapter";
import { RnaPort } from "./rna.port";
import RnaDbo from "./rna.dbo";
import { Rna } from "../../../../identifier-objects";
import { toEntity } from "./rna.mapper";
import { AnyBulkWriteOperation } from "mongodb";

export class RnaAdapter extends MongoAdapter<RnaDbo> implements RnaPort {
    public collectionName = "rna";

    async createIndexes() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    async insertMany(lines: RnaDbo[]) {
        await this.collection.insertMany(lines, { ordered: false });
        return;
    }

    async upsertMany(lines: RnaDbo[]): Promise<void> {
        const operations: AnyBulkWriteOperation<RnaDbo>[] = lines.map(line => ({
            replaceOne: {
                filter: { id: line.id },
                replacement: line,
                upsert: true,
            },
        }));
        await this.collection.bulkWrite(operations, { ordered: false });
    }

    async getByRna(rna: Rna) {
        const dbo = await this.collection.findOne({ id: rna.value });
        if (!dbo) return null;
        return toEntity(dbo);
    }
}
const rnaAdapter = new RnaAdapter();
export default rnaAdapter;
