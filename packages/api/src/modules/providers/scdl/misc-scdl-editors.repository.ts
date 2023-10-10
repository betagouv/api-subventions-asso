import MigrationRepository from "../../../shared/MigrationRepository";
import MiscScdlEditorEntity from "./entities/MiscScdlEditorEntity";

export class MiscScdlEditorsRepository extends MigrationRepository<MiscScdlEditorEntity> {
    readonly collectionName = "misc-scdl-editors";
    readonly collectionImportName = "misc-scdl-editors-IMPORT";

    public async create(entity: MiscScdlEditorEntity) {
        this.collection.insertOne(entity);
    }
}

const miscScdlEditorsRepository = new MiscScdlEditorsRepository();

export default miscScdlEditorsRepository;
