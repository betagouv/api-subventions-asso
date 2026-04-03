import MongoAdapter from "../../MongoAdapter";
import { SireneUniteLegaleDbo } from "../../../../../modules/providers/sirene/stock-unite-legale/@types/SireneUniteLegaleDbo";
import { SireneStockUniteLegaleEntity } from "../../../../../entities//SireneStockUniteLegaleEntity";
import SireneStockUniteLegaleMapper from "../../../../../modules/providers/sirene/stock-unite-legale/mappers/sirene-stock-unite-legale.mapper";
import Siren from "../../../../../identifier-objects/Siren";
import { SireneStockUniteLegalePort } from "./sirene-stock-unite-legale.port";

export class SireneUniteLegaleDbAdapter
    extends MongoAdapter<SireneUniteLegaleDbo>
    implements SireneStockUniteLegalePort
{
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    public async upsertMany(entities: SireneStockUniteLegaleEntity[]): Promise<void> {
        if (!entities.length) return;
        const bulk = entities.map(entity => ({
            updateOne: {
                filter: { siren: entity.siren.value },
                update: { $set: SireneStockUniteLegaleMapper.entityToDbo(entity) },
                upsert: true,
            },
        }));
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async insertOne(entity: SireneStockUniteLegaleEntity): Promise<void> {
        await this.collection.insertOne(SireneStockUniteLegaleMapper.entityToDbo(entity));
    }

    public async updateOne(entity: SireneStockUniteLegaleEntity): Promise<void> {
        await this.collection.updateOne(
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

    public async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }
}

const sireneUniteLegaleDbAdapter = new SireneUniteLegaleDbAdapter();
export default sireneUniteLegaleDbAdapter;
