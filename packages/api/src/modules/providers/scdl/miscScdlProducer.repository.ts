import MigrationRepository from "../../../shared/MigrationRepository";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";

export class MiscScdlProducersRepository extends MigrationRepository<MiscScdlProducerEntity> {
    readonly collectionName = "misc-scdl-producers";

    public async create(entity: MiscScdlProducerEntity) {
        this.collection.insertOne(entity);
    }
}

const miscScdlProducersRepository = new MiscScdlProducersRepository();

export default miscScdlProducersRepository;
