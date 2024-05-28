import MongoRepository from "../../../../shared/MongoRepository";
import { SubventiaDbo } from "../@types/subventia.entity";

export class SubventiaRepository extends MongoRepository<Omit<SubventiaDbo, "_id">> {
    readonly collectionName = "subventia";

    public createIndexes(): void {
        return;
    }

    public async create(entity: Omit<SubventiaDbo, "_id">) {
        return await this.collection.insertOne(entity);
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;
