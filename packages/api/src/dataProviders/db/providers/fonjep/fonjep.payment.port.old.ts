import Siren from "../../../../identifierObjects/Siren";
import Siret from "../../../../identifierObjects/Siret";
import FonjepPaymentEntity from "../../../../modules/providers/fonjep/entities/FonjepPaymentEntity.old";
import { FonjepCorePort } from "./fonjep.core.port.old";

export class FonjepPaymentPort extends FonjepCorePort<FonjepPaymentEntity> {
    readonly collectionName = "fonjepPayment";

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

const fonjepPaymentPort = new FonjepPaymentPort();
export default fonjepPaymentPort;
