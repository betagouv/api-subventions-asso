import { Siren, Siret } from "@api-subventions-asso/dto";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";
import { FonjepCoreRepository } from "./fonjep.core.repository";

export class FonjepVersementRepository extends FonjepCoreRepository<FonjepVersementEntity> {
    readonly collectionName = "fonjepVersement";

    async createIndexes() {
        await this.collection.createIndex({ "indexedInformations.code_poste": 1 });
        await this.collection.createIndex({ "legalInformations.siret": 1 });
    }

    create(entity: FonjepVersementEntity) {
        return this.collection.insertOne(entity);
    }

    findByCodePoste(code: string) {
        return this.collection.find({ "indexedInformations.code_poste": code }).toArray();
    }

    findBySiret(siret: Siret) {
        return this.collection.find({ "legalInformations.siret": siret }).toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren}\\d{5}`),
            })
            .toArray();
    }
}

const fonjepVersementRepository = new FonjepVersementRepository();
export default fonjepVersementRepository;
