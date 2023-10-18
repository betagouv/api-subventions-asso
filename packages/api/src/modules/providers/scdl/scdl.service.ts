import MiscScdlDataEntity from "./entities/MiscScdlDataEntity";
import MiscScdlProducerEntity from "./entities/MiscScdlProducerEntity";
import miscScdlDataRepository from "./repositories/miscScdlData.repository";
import miscScdlProducersRepository from "./repositories/miscScdlProducer.repository";

export class ScdlService {
    createProducer(entity: MiscScdlProducerEntity) {
        return miscScdlProducersRepository.create(entity);
    }

    createData(entity: MiscScdlDataEntity) {
        return miscScdlDataRepository.create(entity);
    }
}

const scdlService = new ScdlService();
export default scdlService;
