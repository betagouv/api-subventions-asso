import MigrationRepository from "../../../../shared/MigrationRepository";
import { SubventiaRequestEntity } from "../entities/SubventiaRequestEntity";

export class SubventiaRepository extends MigrationRepository<SubventiaRequestEntity>{

    public collectionName = "subventia"

    async create(entity: SubventiaRequestEntity) {
        return await this.collection.insertOne(entity);
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;