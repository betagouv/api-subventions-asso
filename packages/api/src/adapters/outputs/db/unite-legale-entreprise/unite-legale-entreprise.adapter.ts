import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";
import MongoAdapter from "../MongoAdapter";
import { UniteLegalEntrepriseEntity } from "../../../../entities//UniteLegalEntrepriseEntity";
import Siren from "../../../../identifierObjects/Siren";
import { UniteLegalEntreprisePort } from "./unite-legale-entreprise.port";
import { UniteLegalEntrepriseMapper } from "./unite-legale-entreprise.mapper";
import { UniteLegalEntrepriseDbo } from "./@types/UniteLegalEntrepriseDbo";

export class UniteLegalEntrepriseAdapter
    extends MongoAdapter<UniteLegalEntrepriseDbo>
    implements UniteLegalEntreprisePort
{
    collectionName = "unite-legal-entreprise";

    async createIndexes(): Promise<void> {
        await this.collection.createIndex({ siren: 1 }, { unique: true });
    }

    async findOneBySiren(siren: Siren): Promise<UniteLegalEntrepriseEntity | null> {
        const dbo = await this.collection.findOne({ siren: siren.value });
        if (!dbo) return null;

        return UniteLegalEntrepriseMapper.toEntity(dbo);
    }

    async insertMany(entities: UniteLegalEntrepriseEntity[]): Promise<void> {
        try {
            const dbos = entities.map(entity => UniteLegalEntrepriseMapper.toDbo(entity));
            await this.collection.insertMany(dbos, { ordered: false });
        } catch (e: unknown) {
            if (isMongoDuplicateError(e)) {
                // One or many entities already exist in database but other entities have been saved
                throw buildDuplicateIndexError<UniteLegalEntrepriseDbo[]>(e);
            }
            throw e;
        }
    }
}

const uniteLegalEntrepriseAdapter = new UniteLegalEntrepriseAdapter();
export default uniteLegalEntrepriseAdapter;
