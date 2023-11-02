import { Siren } from "dto";
import MongoRepository from "../../../../shared/MongoRepository";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";

export class EntrepriseSirenRepository extends MongoRepository<EntrepriseSirenEntity> {
    readonly collectionName = "datagouv-entreprise-siren";

    public createIndexes(): void {
        // no indexes needed
        return;
    }

    async insertMany(entities: EntrepriseSirenEntity[]) {
        return this.collection.insertMany(entities, { ordered: false });
    }

    async create(entity: EntrepriseSirenEntity) {
        return this.collection.insertOne(entity);
    }

    public async findOne(siren: Siren) {
        return this.collection.findOne({ _id: siren });
    }
}

const entrepriseSirenRepository = new EntrepriseSirenRepository();

export default entrepriseSirenRepository;
