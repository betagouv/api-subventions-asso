import MigrationRepository from "../../../../shared/MigrationRepository";
import MiscScdlDataEntity from "../entities/MiscScdlDataEntity";

export class MiscScdlDataRepository extends MigrationRepository<MiscScdlDataEntity> {
    readonly collectionName = "misc-scdl-data";

    public async create(entity: MiscScdlDataEntity) {
        this.collection.insertOne(entity);
    }
}

const miscScdlDataRepository = new MiscScdlDataRepository();

export default miscScdlDataRepository;
