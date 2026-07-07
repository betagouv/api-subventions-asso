import { AnyBulkWriteOperation } from "mongodb";
import MongoAdapter from "../MongoAdapter";
import Siret from "../../../../identifier-objects/Siret";
import { SireneEtablissementEntity } from "../../../../entities/SireneEtablissementEntity";
import { SireneEtablissementDbo } from "../../../../modules/providers/sirene/@types/SireneEtablissementDbo";
import SireneEtablissementMapper from "../../../../modules/providers/sirene/mappers/sirene-etablissement.mapper";
import { SireneEtablissementPort } from "./sirene-etablissement.port";

export class SireneEtablissementAdapter
    extends MongoAdapter<SireneEtablissementDbo>
    implements SireneEtablissementPort
{
    collectionName = "sirene-etablissements";

    public async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siret: 1 }, { unique: true });
        await this.collection.createIndex({ siren: 1 });
    }

    public async upsertMany(entities: SireneEtablissementEntity[]): Promise<void> {
        if (!entities.length) return;

        const bulk: AnyBulkWriteOperation<SireneEtablissementDbo>[] = entities.map(entity => ({
            updateOne: {
                filter: { siret: entity.siret.value },
                update: { $set: SireneEtablissementMapper.entityToDbo(entity) },
                upsert: true,
            },
        }));

        await this.collection.bulkWrite(bulk, { ordered: false });
    }

    public async findOneBySiret(siret: Siret): Promise<SireneEtablissementEntity | null> {
        const dbo = await this.collection.findOne({ siret: siret.value });
        return dbo ? SireneEtablissementMapper.dboToEntity(dbo) : null;
    }
}

const sireneEtablissementAdapter = new SireneEtablissementAdapter();
export default sireneEtablissementAdapter;
