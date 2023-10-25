import MigrationRepository from "../../../../shared/MigrationRepository";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";

export class MiscScdlGrantRepository extends MigrationRepository<MiscScdlGrantEntity> {
    readonly collectionName = "misc-scdl-data";

    public async findAll() {
        return this.collection.find({}).toArray();
    }

    public async createMany(entities: MiscScdlGrantEntity[]) {
        this.collection.insertMany(entities);
    }

    async createIndexes() {
        await this.collection.createIndex({ editorId: 1 });
        await this.collection.createIndex({ associationSiret: 1 });
        await this.collection.createIndex({ associationRna: 1 });
    }
}

const miscScdlGrantRepository = new MiscScdlGrantRepository();

export default miscScdlGrantRepository;
