import MongoRepository from "../../../../shared/MongoRepository";
import SubventiaLineEntity from "../entities/SubventiaLineEntity";

export class SubventiaRepository extends MongoRepository<SubventiaLineEntity> {
    readonly collectionName = "subventia";

    public createIndexes(): void {
        return;
    }

    public async create(entity: SubventiaLineEntity) {
        return await this.collection.insertOne(entity);
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;
