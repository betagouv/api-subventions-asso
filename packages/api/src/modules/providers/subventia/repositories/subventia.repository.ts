import { WithId } from "mongodb";
import MigrationRepository from "../../../../shared/MigrationRepository";
import { SubventiaRequestEntity } from "../entities/SubventiaRequestEntity";

export class SubventiaRepository extends MigrationRepository<SubventiaRequestEntity>{

    public collectionName = "subventia"

    async create(entity: SubventiaRequestEntity) {
        const insertAction = await this.collection.insertOne(entity);
        return await this.collection.findOne({ _id: insertAction.insertedId }) as WithId<SubventiaRequestEntity>;
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;