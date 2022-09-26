import { Siren, Siret } from "@api-subventions-asso/dto";
import MigrationRepository from "../../../../shared/MigrationRepository";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export class FonjepVersementRepository extends MigrationRepository<FonjepVersementEntity> {
    readonly collectionName = "fonjepVersement"

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
        return this.collection.find({
            "legalInformations.siret": new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }
}

const fonjepVersementRepository = new FonjepVersementRepository();
export default fonjepVersementRepository;