import MongoPort from "../../../../shared/MongoPort";
import { SireneUniteLegaleDbo } from "../../../../modules/providers/sirene/stockUniteLegale/@types/SireneUniteLegaleDbo";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import SireneStockUniteLegaleMapper from "../../../../modules/providers/sirene/stockUniteLegale/mappers/sirene-stock-unite-legale.mapper";
import Siren from "../../../../identifierObjects/Siren";

export class SireneUniteLegaleDbPort extends MongoPort<SireneUniteLegaleDbo> {
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    public upsertMany(entities: SireneStockUniteLegaleEntity[]) {
        if (!entities.length) return;
        const bulk = entities.map(entity => ({
            updateOne: {
                filter: { siren: entity.siren.value },
                update: { $set: SireneStockUniteLegaleMapper.entityToDbo(entity) },
                upsert: true,
            },
        }));
        return this.collection.bulkWrite(bulk, { ordered: false });
    }

    public insertOne(entity: SireneStockUniteLegaleEntity) {
        return this.collection.insertOne(SireneStockUniteLegaleMapper.entityToDbo(entity));
    }

    public updateOne(entity: SireneStockUniteLegaleEntity) {
        return this.collection.updateOne(
            { siren: entity.siren },
            { $set: SireneStockUniteLegaleMapper.entityToDbo(entity) },
        );
    }

    public async findAll(): Promise<SireneStockUniteLegaleEntity[]> {
        const dbos = await this.collection.find().toArray();
        return dbos.map(dbo => SireneStockUniteLegaleMapper.dboToEntity(dbo));
    }

    public async findOneBySiren(siren: Siren): Promise<SireneStockUniteLegaleEntity | null> {
        const dbo = await this.collection.findOne({ siren: siren.value });
        return dbo ? SireneStockUniteLegaleMapper.dboToEntity(dbo) : null;
    }

    public deleteAll() {
        return this.collection.deleteMany({});
    }
}

const sireneUniteLegaleDbPort = new SireneUniteLegaleDbPort();
export default sireneUniteLegaleDbPort;
