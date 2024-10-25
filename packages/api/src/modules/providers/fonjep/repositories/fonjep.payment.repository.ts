import Siren from "../../../../valueObjects/Siren";
import Siret from "../../../../valueObjects/Siret";
import FonjepPaymentEntity from "../entities/FonjepPaymentEntity";
import { FonjepCoreRepository } from "./fonjep.core.repository";

export class FonjepPaymentRepository extends FonjepCoreRepository<FonjepPaymentEntity> {
    readonly collectionName = "fonjepVersement";

    readonly joinIndexes = {
        fonjepSubvention: "indexedInformations.joinKey",
    };

    async createIndexes() {
        super.createIndexes();
        await this.collection.createIndex({ "indexedInformations.code_poste": 1 });
        await this.collection.createIndex({ "indexedInformations.joinKey": 1 });
    }

    create(entity: FonjepPaymentEntity) {
        return this.collection.insertOne(entity);
    }

    findByCodePoste(code: string) {
        return this.collection.find({ "indexedInformations.code_poste": code }).toArray();
    }

    findBySiret(siret: Siret) {
        return this.collection.find({ "legalInformations.siret": siret.value }).toArray();
    }

    public findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren.value}\\d{5}`),
            })
            .toArray();
    }
}

const fonjepPaymentRepository = new FonjepPaymentRepository();
export default fonjepPaymentRepository;
