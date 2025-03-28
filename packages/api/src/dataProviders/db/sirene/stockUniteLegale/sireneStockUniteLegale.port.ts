import MongoPort from "../../../../shared/MongoPort";
import { SireneUniteLegaleDbo } from "../../../../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDbo";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";

export class SireneUniteLegaleDbPort extends MongoPort<SireneStockUniteLegaleEntity> {
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    public insertMany(dbos: SireneUniteLegaleDbo[] | SireneStockUniteLegaleEntity[]) {
        return this.collection.insertMany(dbos);
    }

    public insertOne(dbo: SireneStockUniteLegaleEntity | SireneUniteLegaleDbo) {
        return this.collection.insertOne(dbo);
    }

    public updateOne(dbo: SireneUniteLegaleDbo) {
        return this.collection.updateOne({ siren: dbo.siren }, { $set: dbo });
    }

    public findAll() {
        return this.collection.find().toArray();
    }

    public deleteAll() {
        return this.collection.deleteMany({});
    }
}

const sireneUniteLegaleDbPort = new SireneUniteLegaleDbPort();
export default sireneUniteLegaleDbPort;
