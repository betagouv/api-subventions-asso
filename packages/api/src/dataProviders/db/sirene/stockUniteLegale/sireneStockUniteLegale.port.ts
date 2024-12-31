import MongoPort from "../../../../shared/MongoPort";
import { SireneUniteLegaleDbo } from "../../../../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDbo";

export class SireneUniteLegaleDbPort extends MongoPort<SireneUniteLegaleDbo> {
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    public async insertMany(dbos: SireneUniteLegaleDbo[]) {
        return this.collection.insertMany(dbos);
    }

    public async insertOne(dbo: SireneUniteLegaleDbo) {
        return this.collection.insertOne(dbo);
    }

    public async updateOne(dbo: SireneUniteLegaleDbo) {
        return this.collection.updateOne({ siren: dbo.siren }, { $set: dbo });
    }

    public async findAll() {
        return this.collection.find().toArray();
    }

    public async deleteAll() {
        await this.collection.deleteMany({});
    }
}

const sireneUniteLegaleDbPort = new SireneUniteLegaleDbPort();
export default sireneUniteLegaleDbPort;