import MigrationRepository from "../../../shared/MigrationRepository";
import MiscScdlEditorEntity from "./entities/MiscScdlProducerEntity";

export class MiscScdlEditorsRepository extends MigrationRepository<MiscScdlEditorEntity> {
    readonly collectionName = "misc-scdl-producers";

    public async create(entity: MiscScdlEditorEntity) {
        this.collection.insertOne(entity);
    }
}

const miscScdlEditorsRepository = new MiscScdlEditorsRepository();

export default miscScdlEditorsRepository;
