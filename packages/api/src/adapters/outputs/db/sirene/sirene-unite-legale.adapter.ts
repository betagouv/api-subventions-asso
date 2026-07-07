import MongoAdapter from "../MongoAdapter";
import { SireneUniteLegaleDbo } from "../../../../modules/providers/sirene/@types/SireneUniteLegaleDbo";
import SireneUniteLegaleMapper from "../../../../modules/providers/sirene/mappers/sirene-unite-legale.mapper";
import Siren from "../../../../identifier-objects/Siren";
import Rna from "../../../../identifier-objects/Rna";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { SireneUniteLegalePort } from "./sirene-unite-legale.port";

export class SireneUniteLegaleAdapter extends MongoAdapter<SireneUniteLegaleDbo> implements SireneUniteLegalePort {
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    public async upsertMany(entities: SireneUniteLegaleEntity[]): Promise<void> {
        if (!entities.length) return;
        const bulk = entities.map(entity => ({
            updateOne: {
                filter: { siren: entity.siren.value },
                update: { $set: SireneUniteLegaleMapper.entityToDbo(entity) },
                upsert: true,
            },
        }));
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async insertOne(entity: SireneUniteLegaleEntity): Promise<void> {
        await this.collection.insertOne(SireneUniteLegaleMapper.entityToDbo(entity));
    }

    public async updateOne(entity: SireneUniteLegaleEntity): Promise<void> {
        await this.collection.updateOne({ siren: entity.siren }, { $set: SireneUniteLegaleMapper.entityToDbo(entity) });
    }

    public async findAll(): Promise<SireneUniteLegaleEntity[]> {
        const dbos = await this.collection.find().toArray();
        return dbos.map(dbo => SireneUniteLegaleMapper.dboToEntity(dbo));
    }

    public async findOneBySiren(siren: Siren): Promise<SireneUniteLegaleEntity | null> {
        const dbo = await this.collection.findOne({ siren: siren.value });
        return dbo ? SireneUniteLegaleMapper.dboToEntity(dbo) : null;
    }

    public async findSirens(sirens: string[]): Promise<string[]> {
        const uniqueSirens = [...new Set(sirens)];
        if (!uniqueSirens.length) return [];

        const dbos = await this.collection
            .find({ siren: { $in: uniqueSirens } }, { projection: { siren: 1 } })
            .toArray();
        return dbos.map(dbo => dbo.siren);
    }

    public async findOneByRna(rna: Rna): Promise<SireneUniteLegaleEntity | null> {
        const dbo = await this.collection.findOne({ identifiantAssociationUniteLegale: rna });
        return dbo ? SireneUniteLegaleMapper.dboToEntity(dbo) : null;
    }

    public async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }
}

const sireneUniteLegaleAdapter = new SireneUniteLegaleAdapter();
export default sireneUniteLegaleAdapter;
