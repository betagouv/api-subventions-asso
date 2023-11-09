import MongoRepository from "../../../../shared/MongoRepository";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";

export class MiscScdlGrantRepository extends MongoRepository<MiscScdlGrantEntity> {
    readonly collectionName = "misc-scdl-grant";

    public async findAll() {
        return this.collection.find({}).toArray();
    }

    public async createMany(entities: MiscScdlGrantEntity[]) {
        this.collection.insertMany(entities);
    }

    async createIndexes() {
        await this.collection.createIndex({ producerId: 1 });
        await this.collection.createIndex({ associationSiret: 1 });
        await this.collection.createIndex({ associationRna: 1 });
    }
}

const miscScdlGrantRepository = new MiscScdlGrantRepository();

export default miscScdlGrantRepository;
