import { ObjectId } from "mongodb";
import FonjepSubventionEntity from "../../../../modules/providers/fonjep/entities/FonjepSubventionEntity.old";
import Siret from "../../../../identifierObjects/Siret";
import Siren from "../../../../identifierObjects/Siren";
import { FonjepCorePort } from "./fonjep.core.port.old";

export class FonjepSubventionPort extends FonjepCorePort<FonjepSubventionEntity> {
    readonly collectionName = "fonjepSubvention";

    readonly joinIndexes = {
        fonjepPayment: "indexedInformations.joinKey",
    };

    async createIndexes() {
        super.createIndexes();
        await this.collection.createIndex({ "indexedInformations.code_poste": 1 });
        await this.collection.createIndex({ "indexedInformations.joinKey": 1 });
    }

    async create(entity: FonjepSubventionEntity) {
        return await this.collection.insertOne(entity);
    }

    findBySiret(siret: Siret) {
        return this.collection
            .find({
                "legalInformations.siret": siret.value,
            })
            .toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren.value}\\d{5}`),
            })
            .toArray();
    }

    async findById(id: string) {
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    async drop() {
        return this.collection.drop();
    }

    async rename(name: string) {
        return this.collection.rename(name);
    }
}

const fonjepSubventionPort = new FonjepSubventionPort();

export default fonjepSubventionPort;
