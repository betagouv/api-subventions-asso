import { Siren, Siret } from "dto";
import MongoRepository from "../../../../shared/MongoRepository";
import { SubventiaDbo } from "../@types/subventia.entity";
export class SubventiaRepository extends MongoRepository<Omit<SubventiaDbo, "_id">> {
    readonly collectionName = "subventia";

    public async findBySiren(siren: Siren) {
        return this.collection
            .find({
                siret: { $regex: new RegExp(`^${siren}\\d{5}`) },
            })
            .toArray();
    }

    public async findBySiret(siret: Siret) {
        return this.collection.find({ siret: siret }).toArray();
    }

    public createIndexes(): void {
        this.collection.createIndex({ siret: 1 });
        return;
    }

    public async findAll() {
        return await this.collection.find({}).toArray();
    }

    public async create(entity: Omit<SubventiaDbo, "_id">) {
        return await this.collection.insertOne(entity);
    }
}

const subventiaRepository = new SubventiaRepository();

export default subventiaRepository;
