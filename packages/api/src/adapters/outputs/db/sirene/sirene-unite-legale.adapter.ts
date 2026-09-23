import MongoAdapter from "../MongoAdapter";
import { SireneUniteLegaleDbo } from "./SireneUniteLegaleDbo";
import Siren from "../../../../identifier-objects/Siren";
import Rna from "../../../../identifier-objects/Rna";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";
import { SireneUniteLegalePort } from "./sirene-unite-legale.port";
import SireneUniteLegaleMapper from "./sirene-unite-legale.mapper";

export class SireneUniteLegaleAdapter extends MongoAdapter<SireneUniteLegaleDbo> implements SireneUniteLegalePort {
    collectionName = "sirene";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
        await this.collection.createIndex({ identifiantAssociationUniteLegale: 1 });
    }

    public async upsertMany(dbos: SireneUniteLegaleDbo[]): Promise<void> {
        if (!dbos.length) return;
        const bulk = dbos.map(dbo => ({
            updateOne: {
                filter: { siren: dbo.siren },
                update: { $set: dbo },
                upsert: true,
            },
        }));
        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async findAll(): Promise<SireneUniteLegaleEntity[]> {
        const dbos = await this.collection.find().toArray();
        return dbos.map(dbo => SireneUniteLegaleMapper.toEntity(dbo));
    }

    public async findOneBySiren(siren: Siren): Promise<SireneUniteLegaleEntity | null> {
        const dbo = await this.collection.findOne({ siren: siren.value });
        return dbo ? SireneUniteLegaleMapper.toEntity(dbo) : null;
    }

    public async filterExistingSirens(sirens: string[]): Promise<string[]> {
        if (!sirens.length) return [];
        const dbos = await this.collection.find({ siren: { $in: sirens } }, { projection: { siren: 1 } }).toArray();
        return dbos.map(dbo => dbo.siren);
    }

    public async findOneByRna(rna: Rna): Promise<SireneUniteLegaleEntity | null> {
        const dbo = await this.collection.findOne({ identifiantAssociationUniteLegale: rna });
        return dbo ? SireneUniteLegaleMapper.toEntity(dbo) : null;
    }

    public async deleteAll(): Promise<void> {
        await this.collection.deleteMany({});
    }
}

const sireneUniteLegaleAdapter = new SireneUniteLegaleAdapter();
export default sireneUniteLegaleAdapter;
