import MigrationRepository from "../../../../shared/MigrationRepository";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";

export class FonjepVersementRepository extends MigrationRepository<FonjepVersementEntity> {
    readonly collectionName = "fonjepVersement"

    create(entity: FonjepVersementEntity) {
        return this.collection.insertOne(entity);
    }
}

const fonjepVersementRepository = new FonjepVersementRepository();
export default fonjepVersementRepository;