import MigrationRepository from "../../../../shared/MigrationRepository";
import MiscScdlGrantEntity from "../entities/MiscScdlGrantEntity";

export class MiscScdlGrantRepository extends MigrationRepository<MiscScdlGrantEntity> {
    readonly collectionName = "misc-scdl-data";

    public async createMany(entities: MiscScdlGrantEntity[]) {
        this.collection.insertMany(entities);
    }
}

const miscScdlGrantRepository = new MiscScdlGrantRepository();

export default miscScdlGrantRepository;
