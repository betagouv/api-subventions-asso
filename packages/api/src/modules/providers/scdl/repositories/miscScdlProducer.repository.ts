import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlProducerEntity from "../entities/MiscScdlProducerEntity";

export class MiscScdlProducersRepository extends MongoRepository<MiscScdlProducerEntity> {
    readonly collectionName = "misc-scdl-producers";
    readonly joinIndexes = {
        miscScdlGrant: "producerSlug",
    };

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
        // uncomment this after adding SIRET in producers manually
        // await this.collection.createIndex({ siret: 1 }, { unique: true });
    }
}

const miscScdlProducersRepository = new MiscScdlProducersRepository();

export default miscScdlProducersRepository;
