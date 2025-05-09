import MongoPort from "../../../../shared/MongoPort";
import { SireneUniteLegaleDbo } from "../../../../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDbo";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import SireneStockUniteLegaleAdapter from "../../../../modules/providers/sirene/stockUniteLegale/adapter/sireneStockUniteLegale.adapter";

export class SireneUniteLegaleDbPort extends MongoPort<SireneUniteLegaleDbo> {
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    public upsertMany(entities: SireneStockUniteLegaleEntity[]) {
        if (!entities.length) return;
        const bulk = entities.map(entity => ({
            updateOne: {
                filter: { uniqueId: entity.siren.value },
                update: { $set: SireneStockUniteLegaleAdapter.entityToDbo(entity) },
                upsert: true,
            },
        }));
        return this.collection.bulkWrite(bulk, { ordered: false });
    }

    public insertOne(entity: SireneStockUniteLegaleEntity) {
        return this.collection.insertOne(SireneStockUniteLegaleAdapter.entityToDbo(entity));
    }

    public updateOne(entity: SireneStockUniteLegaleEntity) {
        return this.collection.updateOne(
            { siren: entity.siren },
            { $set: SireneStockUniteLegaleAdapter.entityToDbo(entity) },
        );
    }

    public async findAll(): Promise<SireneStockUniteLegaleEntity[]> {
        const dbos = await this.collection.find().toArray();
        return dbos.map(dbo => SireneStockUniteLegaleAdapter.dboToEntity(dbo));
    }

    public deleteAll() {
        return this.collection.deleteMany({});
    }
}

const sireneUniteLegaleDbPort = new SireneUniteLegaleDbPort();
export default sireneUniteLegaleDbPort;
