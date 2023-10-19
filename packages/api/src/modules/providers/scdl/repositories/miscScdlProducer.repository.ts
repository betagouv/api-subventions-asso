import MigrationRepository from "../../../../shared/MigrationRepository";
import MiscScdlProducerEntity from "../entities/MiscScdlProducerEntity";

export class MiscScdlProducersRepository extends MigrationRepository<MiscScdlProducerEntity> {
    readonly collectionName = "misc-scdl-producers";

    public async findByProducerId(producerId: string) {
        return this.collection.findOne({ producerId });
    }

    public async create(entity: MiscScdlProducerEntity) {
        return this.collection.insertOne(entity);
    }
}

const miscScdlProducersRepository = new MiscScdlProducersRepository();

export default miscScdlProducersRepository;
