import MongoRepository from "../../../../shared/MongoRepository";
import SubventiaLineEntity from "../entities/SubventiaLineEntity";
import { buildDuplicateIndexError, isMongoDuplicateError } from "../../../../shared/helpers/MongoHelper";

export class SubventiaRepository extends MongoRepository<SubventiaLineEntity> {
    readonly collectionName = "subventia";

    public createIndexes(): void {
        // create many subventia dbo => execute script pour voir si on a ce qu'on veut
        // no indexes needed
        return;
    }

    async create(entity: SubventiaLineEntity) {
        return await this.collection.insertOne(entity);
    }

    public async insertMany(entities: SubventiaLineEntity[]) {
        return this.collection.insertMany(entities, { ordered: false }).catch(error => {
            if (isMongoDuplicateError(error)) {
                throw buildDuplicateIndexError<SubventiaLineEntity[]>(error);
            }
        });
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;
