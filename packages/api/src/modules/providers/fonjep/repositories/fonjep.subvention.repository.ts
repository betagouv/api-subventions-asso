import { Siren, Siret } from "@api-subventions-asso/dto";
import { ObjectId } from "mongodb";
import FonjepSubventionEntity from "../entities/FonjepSubventionEntity";
import { FonjepCoreRepository } from "./fonjep.core.repository";

export class FonjepSubventionRepository extends FonjepCoreRepository<FonjepSubventionEntity> {
    readonly collectionName = "fonjepSubvention";

    async create(entity: FonjepSubventionEntity) {
        return await this.collection.insertOne(entity);
    }

    findBySiret(siret: Siret) {
        return this.collection
            .find({
                "legalInformations.siret": siret,
            })
            .toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection
            .find({
                "legalInformations.siret": new RegExp(`^${siren}\\d{5}`),
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
