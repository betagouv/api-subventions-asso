import { Siren, Siret } from "@api-subventions-asso/dto";
import { ObjectId, WithId } from "mongodb";
import MigrationRepository from "../../../../shared/MigrationRepository";
import FonjepRequestEntity from "../entities/FonjepRequestEntity";

export class FonjepRepository extends MigrationRepository<FonjepRequestEntity> {
    readonly collectionName = "fonjep";

    async create(entity: FonjepRequestEntity) {
        const insertAction = await this.collection.insertOne(entity);
        return await this.collection.findOne({ _id: insertAction.insertedId }) as WithId<FonjepRequestEntity>;
    }

    findBySiret(siret: Siret) {
        return this.collection.find({
            "legalInformations.siret": siret
        }).toArray();
    }

    findBySiren(siren: Siren) {
        return this.collection.find({
            "legalInformations.siret": new RegExp(`^${siren}\\d{5}`)
        }).toArray();
    }

    async findById(id: string) {
        return this.collection.findOne({ "_id": new ObjectId(id) });
    }
}

const fonjepRepository = new FonjepRepository();

export default fonjepRepository;