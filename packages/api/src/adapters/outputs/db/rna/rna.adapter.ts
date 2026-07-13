import MongoAdapter from "../MongoAdapter";
import { RnaPort } from "./rna.port";
import RnaDbo from "./rna.dbo";

export class RnaAdapter extends MongoAdapter<RnaDbo> implements RnaPort {
    public collectionName = "rna";

    async createIndexes() {
        await this.collection.createIndex({ id: 1 }, { unique: true });
    }

    async insertMany(lines: RnaDbo[]) {
        await this.collection.insertMany(lines, { ordered: false });
        return;
    }
}
const rnaAdapter = new RnaAdapter();
export default rnaAdapter;
