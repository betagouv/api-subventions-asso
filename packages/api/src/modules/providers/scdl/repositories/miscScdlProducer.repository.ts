import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlProducerEntity from "../entities/MiscScdlProducerEntity";

export class MiscScdlProducersRepository extends MongoRepository<MiscScdlProducerEntity> {
    readonly collectionName = "misc-scdl-producers";
    readonly joinIndexes = {
        miscScdlGrant: "slug",
    };

    public async findAll() {
        return this.collection.find({}, { projection: { _id: 0 } }).toArray() as Promise<MiscScdlProducerEntity[]>;
    }

    public async findBySlug(slug: string) {
        return this.collection.findOne({ slug });
    }

    public async create(entity: MiscScdlProducerEntity) {
        return this.collection.insertOne(entity);
    }

    public async update(slug: string, set: Partial<MiscScdlProducerEntity>) {
        return this.collection.updateOne({ slug }, { $set: set });
    }

    async createIndexes() {
        await this.collection.createIndex({ slug: 1 }, { unique: true });
        await this.collection.createIndex({ name: 1 }, { unique: true });
        await this.collection.createIndex({ siret: 1 }, { unique: true });
    }
}

const miscScdlProducersRepository = new MiscScdlProducersRepository();

export default miscScdlProducersRepository;
