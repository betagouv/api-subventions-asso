import { ObjectId } from "mongodb";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import Siret from "../../../../valueObjects/Siret";
import Siren from "../../../../valueObjects/Siren";
import { FonjepCoreRepository } from "./fonjep.core.repository";

export class FonjepSubventionRepository extends FonjepCoreRepository<FonjepSubventionEntity> {
    readonly collectionName = "fonjepSubvention";

    readonly joinIndexes = {
        fonjepVersement: {
            code_poste: "$application.indexedInformations.code_poste",
            year: "$application.indexedInformations.annee_demande",
        },
    };

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

const fonjepSubventionRepository = new FonjepSubventionRepository();

export default fonjepSubventionRepository;
