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
}

const miscScdlGrantRepository = new MiscScdlGrantRepository();

export default miscScdlGrantRepository;
