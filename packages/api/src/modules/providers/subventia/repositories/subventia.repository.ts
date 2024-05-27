import MongoRepository from "../../../../shared/MongoRepository";
import { SubventiaRequestEntity } from "../entities/SubventiaRequestEntity";

export class SubventiaRepository extends MongoRepository<SubventiaRequestEntity> {
    public collectionName = "subventia";

    public createIndexes(): void {
        // no indexes needed
        return;
    }

    async create(entity: SubventiaRequestEntity) {
        return await this.collection.insertOne(entity);
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;
